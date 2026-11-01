import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, mkdir, rm, symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {evaluateProductionQA, reportDigest, readEvidence} from './production-qa.mjs';
import {makeQAReport} from '../experiments/tilicheros-motion-lab/scripts/verify-master.mjs';

const mediaHash = 'a'.repeat(64), sourceHash = 'b'.repeat(64);
function fixture() {
  const videoReport = {
    schema_version: 1, test_type: 'rendered_mp4_technical_validation', pass: true,
    format: {width: 1080, height: 1920, codec: 'h264', fps: 30, duration_seconds: 15, has_audio: true},
    file_size_bytes: 20000, marketing_ready: false, marketing_blockers: []
  };
  const audioReport = {
    status: 'MEASURED_NOT_APPROVED', sample_rate_hz: 48000, channels: 1, bit_depth: 16,
    frames: 720000, duration_seconds: 15,
    channel_measurements: [{channel: 1, sample_peak_dbfs: -6, rms_dbfs: -12, dc_offset: 0, full_scale_sample_count: 0}],
    silence: false, stereo_correlation: null, mono_sum_rms_change_db: null, mono_cancellation_risk: false,
    integrated_lufs: null, true_peak_dbtp: null, listening_review: 'NOT_PERFORMED', rights: 'NOT_VERIFIED',
    commercial_certification: false
  };
  const videoDigest = reportDigest(videoReport), audioDigest = reportDigest(audioReport);
  const review = () => ({status: 'PASS', reviewer: 'Fixture reviewer (synthetic)',
    evidence: 'Synthetic fixture only; no real media review', media_sha256: mediaHash,
    video_report_sha256: videoDigest, audio_report_sha256: audioDigest});
  return {schema_version: 1, media: {sha256: mediaHash},
    video: {media_sha256: mediaHash, report_sha256: videoDigest, report: videoReport},
    audio: {media_sha256: mediaHash, report_sha256: audioDigest, source_sha256: sourceHash,
      relationship: {kind: 'DECODED_FINAL_AUDIO', verified: true, reviewer: 'Synthetic fixture',
        evidence: 'Synthetic decoded-audio attestation', media_sha256: mediaHash, source_sha256: sourceHash},
      report: audioReport},
    reviews: Object.fromEntries(['listening', 'synchronization', 'intelligibility', 'visual', 'rights'].map(n => [n, review()]))};
}

function expectBlocked(bundle, pattern) {
  const result = evaluateProductionQA(bundle);
  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.publication_authorized, false);
  assert.ok(result.blockers.some(x => pattern.test(x)), JSON.stringify(result.blockers));
}

function refreshAudioDigest(bundle) {
  const digest = reportDigest(bundle.audio.report);
  bundle.audio.report_sha256 = digest;
  for (const review of Object.values(bundle.reviews)) review.audio_report_sha256 = digest;
}

test('measured WAV identity agrees with sidecar hash while legacy evidence remains explicitly attested', () => {
  const legacy = fixture();
  assert.equal(evaluateProductionQA(legacy).status, 'READY_FOR_CLIENT_REVIEW');
  const bundle = fixture();
  bundle.audio.report.source = {sha256: sourceHash, size_bytes: 1440044};
  refreshAudioDigest(bundle);
  assert.equal(evaluateProductionQA(bundle).status, 'READY_FOR_CLIENT_REVIEW');
  for (const source of [null, {}, {sha256: 'f'.repeat(64), size_bytes: 1440044},
    {sha256: sourceHash, size_bytes: 1}, {sha256: sourceHash, size_bytes: '1440044'},
    {sha256: sourceHash, size_bytes: -1}]) {
    const bad = structuredClone(bundle);
    bad.audio.report.source = source;
    refreshAudioDigest(bad);
    expectBlocked(bad, /Measured WAV source identity/);
  }
});

function withOriginalVideoBlockers() {
  const bundle = fixture();
  bundle.video.report = makeQAReport({streams: [
    {codec_type: 'video', codec_name: 'h264', width: 1080, height: 1920, avg_frame_rate: '30/1'},
    {codec_type: 'audio'}], format: {duration: '15'}}, 20000);
  const digest = reportDigest(bundle.video.report);
  bundle.video.report_sha256 = digest;
  for (const review of Object.values(bundle.reviews)) review.video_report_sha256 = digest;
  bundle.blocker_resolutions = bundle.video.report.marketing_blockers.map((blocker, index) => ({
    ...bundle.reviews.rights, status: 'RESOLVED', action: 'VERIFIED_CURRENT_MEDIA', blocker,
    resolution: 'Synthetic fixture: cause corrected and current final independently reviewed, item ' + index
  }));
  return bundle;
}

test('original makeQAReport blockers remain intact and require one explicit current resolution each', () => {
  const bundle = withOriginalVideoBlockers();
  const before = structuredClone(bundle.video.report.marketing_blockers);
  assert.equal(before.length, 4);
  const result = evaluateProductionQA(bundle);
  assert.equal(result.status, 'READY_FOR_CLIENT_REVIEW');
  assert.deepEqual(result.original_video_blockers, before);
  assert.deepEqual(bundle.video.report.marketing_blockers, before);
  assert.equal(result.applied_blocker_resolutions.length, 4);
  assert.deepEqual(result.pending_video_blockers, []);
  assert.equal(result.publication_authorized, false);
});

test('missing, malformed, revoked, failed, stale, duplicate and unknown blocker resolutions stay blocked', () => {
  for (const mutate of [
    b => {delete b.blocker_resolutions;}, b => {b.blocker_resolutions = {};},
    b => {b.blocker_resolutions.pop();}, b => {b.blocker_resolutions[0].revoked = true;},
    b => {b.blocker_resolutions[0].status = 'WAIVED';}, b => {b.blocker_resolutions[0].action = 'ACCEPT_RISK';},
    b => {b.blocker_resolutions[0].resolution = '';}, b => {b.blocker_resolutions[0].reviewer = '';},
    b => {b.blocker_resolutions[0].evidence = '';}, b => {b.blocker_resolutions[0].media_sha256 = 'f'.repeat(64);},
    b => {b.blocker_resolutions[0].video_report_sha256 = 'f'.repeat(64);},
    b => {b.blocker_resolutions[0].audio_report_sha256 = 'f'.repeat(64);},
    b => {b.blocker_resolutions.push({...b.blocker_resolutions[0]});},
    b => {b.blocker_resolutions.push({...b.blocker_resolutions[0], blocker: 'Unknown blocker'});},
    b => {b.blocker_resolutions.push(null);}
  ]) {
    const bundle = withOriginalVideoBlockers(); mutate(bundle);
    expectBlocked(bundle, /[Bb]locker resolution|[Uu]nresolved video blocker/);
  }
  const incomplete = withOriginalVideoBlockers(); incomplete.blocker_resolutions.pop();
  const result = evaluateProductionQA(incomplete);
  assert.deepEqual(result.pending_video_blockers, incomplete.video.report.marketing_blockers.slice(-1));
  assert.equal(result.applied_blocker_resolutions.length, 3);
});

test('complete synthetic evidence reaches client review, never publication or listening certification', () => {
  const result = evaluateProductionQA(fixture());
  assert.equal(result.status, 'READY_FOR_CLIENT_REVIEW');
  assert.equal(result.client_signoff, 'PENDING_OR_INVALID');
  assert.equal(result.publication_authorized, false);
  assert.ok(result.limitations.some(x => /does not inspect media, listen/.test(x)));
});

test('incomplete bundles and missing technical/audio reports fail closed', () => {
  for (const input of [null, [], {}, {schema_version: 1}]) expectBlocked(input, /Video technical report/);
  const bundle = fixture(); delete bundle.audio;
  expectBlocked(bundle, /Audio report/);
});

test('mismatched media, report mutation and sidecar source never reuse old approvals', () => {
  const media = fixture(); media.video.media_sha256 = 'c'.repeat(64);
  expectBlocked(media, /different or unidentified/);
  const digest = fixture(); digest.audio.report.channel_measurements[0].rms_dbfs = -20;
  expectBlocked(digest, /digest.*mismatched/);
  const sidecar = fixture(); sidecar.audio.relationship.source_sha256 = 'c'.repeat(64);
  expectBlocked(sidecar, /explicitly attested/);
  const review = fixture(); review.reviews.listening.audio_report_sha256 = 'c'.repeat(64);
  expectBlocked(review, /Manual listening/);
});

test('false or revoked extraction and source-stem reports block', () => {
  for (const mutation of [r => {r.verified = false;}, r => {r.revoked = true;}, r => {r.revoked = 'false';}, r => {r.kind = 'SOURCE_STEM';}]) {
    const bundle = fixture(); mutation(bundle.audio.relationship);
    expectBlocked(bundle, /explicitly attested/);
  }
});

test('video missing embedded audio, failed technical report, incorrect profile and active marketing blockers block', () => {
  for (const [mutate, pattern] of [
    [v => {v.format.has_audio = false;}, /embedded audio/],
    [v => {v.pass = false;}, /unsupported or failed/],
    [v => {v.format.width = 720;}, /FullHD profile/],
    [v => {v.marketing_blockers = ['Conceptual product, rights missing'];}, /Unresolved video blocker/],
    [v => {v.marketing_blockers = false;}, /marketing blockers must/],
    [v => {v.marketing_ready = true;}, /automatic marketing approval/]
  ]) {const bundle = fixture(); mutate(bundle.video.report); expectBlocked(bundle, pattern);}
});

test('audio metadata rejects coercion, nonfinite values, inconsistent channels, rates and duration', () => {
  for (const [mutate, pattern] of [
    [a => {a.sample_rate_hz = '48000';}, /PCM metadata/],
    [a => {a.duration_seconds = Infinity;}, /PCM metadata/],
    [a => {a.duration_seconds = 2;}, /duration does not match/],
    [a => {a.channel_measurements[0].sample_peak_dbfs = 6;}, /channel measurements/],
    [a => {a.channel_measurements[0].full_scale_sample_count = -1;}, /channel measurements/],
    [a => {a.channel_measurements[0].rms_dbfs = -2;}, /channel measurements/],
    [a => {a.channel_measurements = [];}, /channel measurements/],
    [a => {a.integrated_lufs = -14;}, /cannot certify LUFS/],
    [a => {a.commercial_certification = true;}, /not approval/]
  ]) {const bundle = fixture(); mutate(bundle.audio.report); expectBlocked(bundle, pattern);}
});

test('silence, cancellation and full-scale sample risks require review without claiming clipping', () => {
  const silence = fixture(); silence.audio.report.silence = true;
  expectBlocked(silence, /silent/);
  const mono = fixture(); mono.audio.report.mono_cancellation_risk = true;
  expectBlocked(mono, /Mono cancellation/);
  const full = fixture(); full.audio.report.channel_measurements[0].full_scale_sample_count = 1;
  expectBlocked(full, /audible clipping is not established/);
});

test('all five human reviews must be explicit, current and tied to exact report digests', () => {
  for (const field of ['listening', 'synchronization', 'intelligibility', 'visual', 'rights']) {
    for (const mutate of [r => {r.status = 'PENDING';}, r => {r.revoked = true;}, r => {r.revoked = 'false';}, r => {r.evidence = '';},
      r => {r.media_sha256 = 'f'.repeat(64);}, r => {delete r.reviewer;}]) {
      const bundle = fixture(); mutate(bundle.reviews[field]); expectBlocked(bundle, new RegExp('Manual ' + field));
    }
  }
});

test('incomplete checked-in template prints BLOCKED and exits 2; digest command is read-only', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const result = spawnSync(process.execPath, ['scripts/production-qa.mjs', '--bundle', 'examples/production-review.json'],
    {cwd: root, encoding: 'utf8', windowsHide: true, shell: false});
  assert.equal(result.status, 2, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 'BLOCKED');
  const digest = spawnSync(process.execPath, ['scripts/production-qa.mjs', '--digest-report', 'examples/production-review.json'],
    {cwd: root, encoding: 'utf8', windowsHide: true, shell: false});
  assert.equal(digest.status, 0, digest.stderr);
  assert.match(digest.stdout.trim(), /^[a-f0-9]{64}$/);
});

test('recorded client signoff never grants publication; rejection/revocation blocks', () => {
  const bundle = fixture(); bundle.reviews.client_signoff = {...bundle.reviews.visual};
  const result = evaluateProductionQA(bundle);
  assert.equal(result.client_signoff, 'RECORDED_NOT_AUTHENTICATED');
  assert.equal(result.publication_authorized, false);
  bundle.reviews.client_signoff.revoked = true;
  expectBlocked(bundle, /client signoff/);
  bundle.reviews.client_signoff = {status: 'FAIL'};
  expectBlocked(bundle, /client signoff/);
});

test('input reader accepts bounded workspace JSON and rejects traversal, oversized, malformed and symlink evidence', async t => {
  const root = await mkdtemp(join(tmpdir(), 'altiora-production-qa-'));
  t.after(() => rm(root, {recursive: true, force: true}));
  await mkdir(join(root, 'out'));
  await writeFile(join(root, 'out', 'review.json'), JSON.stringify(fixture()));
  assert.equal((await readEvidence(root, 'out/review.json')).schema_version, 1);
  await assert.rejects(readEvidence(root, '../outside.json'), /escapes workspace/);
  await writeFile(join(root, 'out', 'large.json'), ' '.repeat(1024 * 1024 + 1));
  await assert.rejects(readEvidence(root, 'out/large.json'), /no larger than 1 MiB/);
  await writeFile(join(root, 'out', 'bad.json'), '{');
  await assert.rejects(readEvidence(root, 'out/bad.json'), SyntaxError);
  await t.test('symlink or junction evidence is rejected', async subtest => {
    try {
      await symlink(join(root, 'out'), join(root, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
    } catch (error) {
      if (process.platform === 'win32' && ['EPERM', 'EACCES'].includes(error.code)) {
        const result = spawnSync('cmd', ['/d', '/c', 'mklink', '/J', join(root, 'linked'), join(root, 'out')],
          {encoding: 'utf8', windowsHide: true, shell: false});
        if (result.status !== 0) return subtest.skip('This environment permits neither symlinks nor test junctions');
      } else if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
        return subtest.skip('This environment does not permit test symlinks');
      } else {throw error;}
    }
    await assert.rejects(readEvidence(root, 'linked/review.json'), /Symbolic link or junction/);
  });
});
