#!/usr/bin/env node
/** Aggregate existing evidence, never render, listen, grant rights or publish. */
import {createHash} from 'node:crypto';
import {readFile, stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {safeLocalPath} from './local-path-safety.mjs';

const SHA256 = /^[a-f0-9]{64}$/;
const MAX_JSON_BYTES = 1024 * 1024;
const isObject = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = x => typeof x === 'string' && x.trim().length > 0;
const hash = x => typeof x === 'string' && SHA256.test(x);
const number = x => typeof x === 'number' && Number.isFinite(x);
const positive = x => number(x) && x > 0;
const integer = x => Number.isSafeInteger(x) && x >= 0;
const db = x => x === null || (number(x) && x <= 0);
const notRevoked = x => x.revoked === undefined || x.revoked === false;

// Stable by JSON property order, not an interchangeable canonical JSON scheme.
// Digest the parsed JSON in the same order, as --digest-report does.
export function reportDigest(report) {
  return createHash('sha256').update(JSON.stringify(report)).digest('hex');
}

export function evaluateProductionQA(bundle) {
  const blockers = [];
  const require = (ok, reason) => {if (!ok) blockers.push(reason);};
  bundle = isObject(bundle) ? bundle : {};
  require(bundle.schema_version === 1, 'Bundle schema_version must be 1');
  const media = isObject(bundle.media) ? bundle.media : {};
  require(hash(media.sha256), 'Final media SHA-256 is missing or invalid');
  const video = isObject(bundle.video) ? bundle.video : {};
  const audio = isObject(bundle.audio) ? bundle.audio : {};
  const v = isObject(video.report) ? video.report : {};
  const a = isObject(audio.report) ? audio.report : {};
  const videoDigest = reportDigest(v), audioDigest = reportDigest(a);
  for (const [name, entry, digest] of [['Video', video, videoDigest], ['Audio', audio, audioDigest]]) {
    require(hash(entry.media_sha256) && entry.media_sha256 === media.sha256, `${name} report belongs to a different or unidentified final media`);
    require(hash(entry.report_sha256) && entry.report_sha256 === digest, `${name} report digest is missing or mismatched`);
  }

  require(v.schema_version === 1 && v.test_type === 'rendered_mp4_technical_validation' && v.pass === true,
    'Video technical report is missing, unsupported or failed');
  const f = isObject(v.format) ? v.format : {};
  require(f.width === 1080 && f.height === 1920 && f.codec === 'h264'
    && number(f.fps) && Math.abs(f.fps - 30) < 0.05
    && number(f.duration_seconds) && Math.abs(f.duration_seconds - 15) < 0.20
    && integer(v.file_size_bytes) && v.file_size_bytes > 10000,
  'Video metrics do not satisfy the existing vertical 15s FullHD profile');
  require(f.has_audio === true, 'Final video has no verified embedded audio');
  require(v.marketing_ready === false, 'Video report must not assert automatic marketing approval');
  require(Array.isArray(v.marketing_blockers) && v.marketing_blockers.every(text), 'Video marketing blockers must be an array of nonempty strings');
  const originalVideoBlockers = Array.isArray(v.marketing_blockers) ? v.marketing_blockers.filter(text) : [];
  const originalReasons = new Set(originalVideoBlockers);
  require(originalReasons.size === originalVideoBlockers.length, 'Original video blockers contain ambiguous duplicate reasons');
  const resolutions = bundle.blocker_resolutions === undefined ? [] : bundle.blocker_resolutions;
  require(Array.isArray(resolutions), 'Blocker resolutions must be an array');
  const records = Array.isArray(resolutions) ? resolutions : [];
  const appliedResolutions = [];
  const recordCounts = new Map();
  for (const record of records) {
    if (isObject(record) && text(record.blocker)) recordCounts.set(record.blocker, (recordCounts.get(record.blocker) || 0) + 1);
  }
  for (const record of records) {
    if (!isObject(record) || !text(record.blocker) || !originalReasons.has(record.blocker)) {
      blockers.push('Blocker resolution is malformed or refers to an unknown original blocker');
      continue;
    }
    if (recordCounts.get(record.blocker) !== 1) {
      blockers.push('Duplicate blocker resolution: ' + record.blocker);
      continue;
    }
    if (record.status !== 'RESOLVED' || record.action !== 'VERIFIED_CURRENT_MEDIA'
      || !validBoundEvidence(record) || !text(record.resolution)) {
      blockers.push('Blocker resolution is incomplete, failed, revoked or tied to stale evidence: ' + record.blocker);
      continue;
    }
    appliedResolutions.push({blocker: record.blocker, resolution: record.resolution,
      reviewer: record.reviewer, evidence: record.evidence});
  }
  const resolvedReasons = new Set(appliedResolutions.map(r => r.blocker));
  const pendingVideoBlockers = originalVideoBlockers.filter(reason => !resolvedReasons.has(reason));
  for (const reason of pendingVideoBlockers) {
    blockers.push('Unresolved video blocker: ' + reason);
  }

  require(a.status === 'MEASURED_NOT_APPROVED' && a.commercial_certification === false
    && a.listening_review === 'NOT_PERFORMED' && a.rights === 'NOT_VERIFIED',
  'Audio report must be original sample measurement evidence, not approval');
  require([1, 2].includes(a.channels) && [8, 16, 24, 32].includes(a.bit_depth)
    && integer(a.sample_rate_hz) && a.sample_rate_hz > 0 && integer(a.frames) && a.frames > 0
    && positive(a.duration_seconds) && Math.abs(a.duration_seconds - a.frames / a.sample_rate_hz) < 0.000001,
  'Audio PCM metadata is malformed or inconsistent');
  require(positive(a.duration_seconds) && number(f.duration_seconds)
    && Math.abs(a.duration_seconds - f.duration_seconds) <= 0.20,
  'Measured audio duration does not match the final video');
  require(a.integrated_lufs === null && a.true_peak_dbtp === null,
    'Sample meter cannot certify LUFS or true peak');
  require(typeof a.silence === 'boolean' && typeof a.mono_cancellation_risk === 'boolean'
    && (a.stereo_correlation === null || (number(a.stereo_correlation) && Math.abs(a.stereo_correlation) <= 1))
    && (a.mono_sum_rms_change_db === null || (number(a.mono_sum_rms_change_db) && a.mono_sum_rms_change_db <= 0.000001)),
  'Audio risk measurements are malformed');
  if (a.channels === 1) {
    require(a.stereo_correlation === null && a.mono_sum_rms_change_db === null && a.mono_cancellation_risk === false,
      'Mono input must not report stereo measurements');
  } else if (a.channels === 2 && a.silence === false) {
    const measuredRisk = a.mono_sum_rms_change_db === null || (number(a.mono_sum_rms_change_db) && a.mono_sum_rms_change_db <= -20);
    require(a.mono_cancellation_risk === measuredRisk, 'Mono cancellation risk flag contradicts measured sum loss');
  }
  const channels = a.channel_measurements;
  const validChannels = Array.isArray(channels) && channels.length === a.channels
    && channels.every((c, index) => isObject(c) && c.channel === index + 1
      && db(c.sample_peak_dbfs) && db(c.rms_dbfs) && number(c.dc_offset) && Math.abs(c.dc_offset) <= 1
      && integer(c.full_scale_sample_count) && c.full_scale_sample_count <= a.frames
      && ((c.sample_peak_dbfs === null && c.rms_dbfs === null && c.dc_offset === 0 && c.full_scale_sample_count === 0)
        || (number(c.sample_peak_dbfs) && number(c.rms_dbfs) && c.rms_dbfs <= c.sample_peak_dbfs + 0.000001)));
  require(validChannels, 'Audio channel measurements are malformed or inconsistent');
  if (validChannels) {
    require(a.silence === channels.every(c => c.sample_peak_dbfs === null), 'Audio silence flag contradicts channel measurements');
    require(!channels.some(c => c.full_scale_sample_count > 0), 'Full-scale samples require further audio review; audible clipping is not established');
  }
  require(a.silence === false, 'Measured audio is silent or has not been verified');
  require(a.mono_cancellation_risk === false, 'Mono cancellation risk requires further audio review');

  const relationship = isObject(audio.relationship) ? audio.relationship : {};
  require(hash(audio.source_sha256), 'Measured WAV SHA-256 is missing or invalid');
  require(relationship.kind === 'DECODED_FINAL_AUDIO' && relationship.verified === true
    && notRevoked(relationship) && relationship.media_sha256 === media.sha256
    && relationship.source_sha256 === audio.source_sha256
    && text(relationship.reviewer) && text(relationship.evidence),
  'Measured WAV must be explicitly attested as decoded audio of this exact final video');

  const reviews = isObject(bundle.reviews) ? bundle.reviews : {};
  function validBoundEvidence(review) {
    return isObject(review) && notRevoked(review)
      && text(review.reviewer) && text(review.evidence)
      && hash(review.media_sha256) && review.media_sha256 === media.sha256
      && review.video_report_sha256 === videoDigest && review.audio_report_sha256 === audioDigest;
  }
  function validReview(review) {
    return validBoundEvidence(review) && review.status === 'PASS';
  }
  for (const name of ['listening', 'synchronization', 'intelligibility', 'visual', 'rights']) {
    require(validReview(reviews[name]), `Manual ${name} review missing, failed, revoked or bound to different evidence`);
  }
  if (reviews.client_signoff !== undefined) {
    require(validReview(reviews.client_signoff), 'Supplied client signoff is failed, revoked, incomplete or belongs to different evidence');
  }
  const clientSignoff = validReview(reviews.client_signoff) ? 'RECORDED_NOT_AUTHENTICATED' : 'PENDING_OR_INVALID';
  return {
    schema_version: 1, test_type: 'combined_production_evidence_review',
    status: blockers.length ? 'BLOCKED' : 'READY_FOR_CLIENT_REVIEW',
    media_sha256: hash(media.sha256) ? media.sha256 : null,
    report_digests: {video: videoDigest, audio: audioDigest},
    original_video_blockers: originalVideoBlockers,
    applied_blocker_resolutions: appliedResolutions,
    pending_video_blockers: pendingVideoBlockers,
    blockers, client_signoff: clientSignoff, publication_authorized: false,
    limitations: [
      'Aggregates supplied evidence; does not inspect media, listen, authenticate reviewers or establish provenance.',
      'Identity and decoded-audio relationship are explicit attestations, not proof that a producer measured these bytes.',
      'Sample meter does not measure integrated LUFS or true peak. Final codec listening remains manual.',
      'READY_FOR_CLIENT_REVIEW and a recorded signoff never grant publication, account access or commercial rights.'
    ]
  };
}

export async function readEvidence(root, path) {
  const target = await safeLocalPath(root, resolve(root, path));
  const info = await stat(target);
  if (!info.isFile() || info.size > MAX_JSON_BYTES) throw new Error('Evidence must be a JSON file no larger than 1 MiB');
  const data = await readFile(target);
  if (data.length > MAX_JSON_BYTES) throw new Error('Evidence exceeds 1 MiB');
  return JSON.parse(data.toString('utf8').replace(/^\uFEFF/, ''));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || !['--bundle', '--digest-report'].includes(args[0])) {
    throw new Error('Use --bundle <workspace-relative.json> or --digest-report <workspace-relative.json>');
  }
  const data = await readEvidence(process.cwd(), args[1]);
  if (args[0] === '--digest-report') {console.log(reportDigest(data)); return;}
  const result = evaluateProductionQA(data);
  console.log(JSON.stringify(result, null, 2));
  if (result.status === 'BLOCKED') process.exitCode = 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {console.error('PRODUCTION_QA_FAILED: ' + error.message); process.exitCode = 1;});
}
