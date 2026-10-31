#!/usr/bin/env node
// Local metadata only. Never changes Git, reads secret files or grants publication.
import {spawnSync} from 'node:child_process';
import {resolve, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

function repositoryName(value, stripSuffix = false) {
  if (typeof value !== 'string') return null;
  const parts = value.split('/');
  if (parts.length !== 2) return null;
  const [owner, originalRepo] = parts;
  const repo = stripSuffix ? originalRepo.replace(/\.git$/i, '') : originalRepo;
  if (!/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(owner)
    || !/^[a-z0-9._-]{1,100}$/i.test(repo) || ['.', '..'].includes(repo)
    || (!stripSuffix && /\.git$/i.test(repo))) return null;
  return `${owner}/${repo}`.toLowerCase();
}

function hostName(value) {
  return typeof value === 'string' && /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i.test(value)
    && !value.includes('..') ? value.toLowerCase() : null;
}

export function normalizeRemote(value) {
  if (typeof value !== 'string' || value.length > 8192 || /[\x00-\x20\x7f]/.test(value)) return null;
  let host, path;
  if (/^(?:https|ssh):\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if (!['https:', 'ssh:'].includes(url.protocol) || url.port) return null;
      host = url.hostname;
      path = url.pathname.replace(/^\//, '');
    } catch {return null;}
  } else {
    const ssh = value.match(/^(?:[^@/\s]+@)?([a-z0-9.-]+):([^?#\s]+)$/i);
    if (!ssh) return null;
    [, host, path] = ssh;
  }
  host = hostName(host);
  const repository = repositoryName(path, true);
  return host && repository ? {host, repository} : null;
}

export function evaluateIdentity({expected = null, expectedHost = 'github.com', observations = {}} = {}) {
  const target = repositoryName(expected), host = hostName(expectedHost);
  // Revalidate injected data and retain only allowlisted values, never raw Git text.
  const observedHost = hostName(observations?.remote?.host);
  const observedRepo = repositoryName(observations?.remote?.repository);
  const remote = observedHost && observedRepo ? {host: observedHost, repository: observedRepo} : null;
  const worktree = observations?.worktree === true;
  const statusOK = observations?.status_ok === true;
  const dirty = typeof observations?.dirty === 'boolean' ? observations.dirty : null;
  const attached = typeof observations?.branch === 'string' && observations.branch.trim().length > 0
    && !/[\x00-\x20\x7f]/.test(observations.branch);
  let status, reasons;
  if (!target || !host) {
    status = 'TARGET_NOT_CONFIRMED';
    reasons = ['An explicit valid owner/repository and expected host are required; never infer the target from origin.'];
  } else if (!worktree || !statusOK || dirty === null) {
    status = 'WORKTREE_CHECK_FAILED';
    reasons = ['Git worktree or status could not be checked; an origin match cannot override this failure.'];
  } else if (!remote) {
    status = 'REMOTE_NOT_CONFIRMED';
    reasons = ['Origin is absent, unreadable or uses an unsupported remote format.'];
  } else if (remote.host !== host || remote.repository !== target) {
    status = 'TARGET_MISMATCH';
    reasons = ['Observed origin host/repository differs from the explicitly expected target.'];
  } else if (!attached || dirty) {
    status = 'WORKTREE_REVIEW_REQUIRED';
    reasons = [!attached ? 'Detached or unconfirmed branch requires review.' : 'Tracked worktree changes require review before publication.'];
  } else {
    status = 'IDENTITY_CONFIRMED_NOT_PUBLISH_AUTHORIZATION';
    reasons = ['Origin matches the explicit target; worktree checks succeeded and tracked files are clean.'];
  }
  return {schema_version: 1, report_type: 'local_project_identity', status,
    expected: target && host ? {host, repository: target} : null, observed_origin: remote,
    checks: {worktree, status_ok: statusOK, tracked_changes: dirty, attached_branch: attached},
    reasons, exit_code: status === 'IDENTITY_CONFIRMED_NOT_PUBLISH_AUTHORIZATION' ? 0 : 2,
    publication_authorized: false,
    limitations: [
      'Read-only local metadata snapshot. No network, push, commit, configuration change or remote ownership verification.',
      'Untracked files are not scanned. Passing identity does not approve content, secrets, tests, licenses or publication.',
      'Raw remote URLs, credentials, errors, branch names and changed file paths are omitted.'
    ]};
}

export function inspectProject({project = process.cwd(), expected = null, expectedHost = 'github.com', runner = spawnSync} = {}) {
  const prefix = ['--no-optional-locks', '-c', 'core.fsmonitor=false', '-c', 'core.untrackedCache=false', '-C', resolve(project)];
  const run = args => {
    try {return runner('git', [...prefix, ...args], {encoding: 'utf8', timeout: 10000,
      maxBuffer: 256 * 1024, windowsHide: true, shell: false});}
    catch {return {status: null};}
  };
  const worktree = run(['rev-parse', '--is-inside-work-tree']);
  const remote = run(['config', '--get', 'remote.origin.url']);
  const branch = run(['symbolic-ref', '--short', '-q', 'HEAD']);
  const status = run(['status', '--porcelain=v1', '--untracked-files=no']);
  const successful = result => !result.error && result.status === 0 && typeof result.stdout === 'string';
  return evaluateIdentity({expected, expectedHost, observations: {
    worktree: successful(worktree) && worktree.stdout.trim() === 'true',
    remote: successful(remote) ? normalizeRemote(remote.stdout.trim()) : null,
    branch: successful(branch) ? branch.stdout.trim() : null,
    status_ok: successful(status), dirty: successful(status) ? status.stdout.trim().length > 0 : null
  }});
}

function main() {
  const args = process.argv.slice(2), options = {};
  const keys = {'--project': 'project', '--expected': 'expected', '--expected-host': 'expectedHost'};
  for (let i = 0; i < args.length; i += 2) {
    if (!keys[args[i]] || typeof args[i + 1] !== 'string' || args[i + 1].startsWith('--')
      || options[keys[args[i]]] !== undefined) throw new Error('Invalid arguments');
    options[keys[args[i]]] = args[i + 1];
  }
  if (options.project && !isAbsolute(options.project)) throw new Error('Project path must be absolute');
  const report = inspectProject(options);
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exitCode = report.exit_code;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {main();}
  catch {process.stderr.write('PROJECT_IDENTITY_FAILED: use --expected owner/repository and optional --project absolute-path / --expected-host host\n'); process.exitCode = 1;}
}
