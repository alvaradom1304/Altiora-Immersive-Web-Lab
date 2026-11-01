import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRemote, evaluateIdentity, inspectProject} from './project-identity.mjs';

const observations = (changes = {}) => ({worktree: true, status_ok: true, dirty: false,
  branch: 'feature/toolkit', remote: {host: 'github.com', repository: 'altiora/company'}, ...changes});

test('HTTPS and SSH remotes normalize without retaining credentials or fragments', () => {
  for (const url of ['https://user:super-secret@GitHub.com/Altiora/Company.git?token=private#fragment',
    'git@github.com:Altiora/Company.git', 'ssh://git@github.com/Altiora/Company.git']) {
    const result = normalizeRemote(url);
    assert.deepEqual(result, {host: 'github.com', repository: 'altiora/company'});
    assert.doesNotMatch(JSON.stringify(result), /super-secret|private|user:|fragment/);
  }
  for (const url of ['not-a-remote', 'file:///private/repo.git', 'https://github.com/a/b/extra',
    'https://github.com/owner/repo%2fextra', 'git@github.com:owner/repo.git\ncredential']) {
    assert.equal(normalizeRemote(url), null);
  }
});

test('expected target is never inferred from the observed remote', () => {
  const result = evaluateIdentity({observations: observations()});
  assert.equal(result.status, 'TARGET_NOT_CONFIRMED');
  assert.equal(result.publication_authorized, false);
  assert.equal(result.exit_code, 2);
});

test('matching clean worktree confirms identity only and never grants authorization', () => {
  const result = evaluateIdentity({expected: 'Altiora/Company', observations: observations()});
  assert.equal(result.status, 'IDENTITY_CONFIRMED_NOT_PUBLISH_AUTHORIZATION');
  assert.equal(result.exit_code, 0);
  assert.equal(result.publication_authorized, false);
});

test('wrong repository and lookalike host remain blocked', () => {
  for (const remote of [{host: 'github.com', repository: 'altiora/client'},
    {host: 'github.com.evil.invalid', repository: 'altiora/company'}]) {
    const result = evaluateIdentity({expected: 'altiora/company', observations: observations({remote})});
    assert.equal(result.status, 'TARGET_MISMATCH');
    assert.equal(result.exit_code, 2);
  }
});

test('status failure, absent worktree, detached HEAD and dirty state prevent confirmation', () => {
  for (const change of [{status_ok: false}, {worktree: false}, {branch: null}, {dirty: true}, {remote: null}]) {
    const result = evaluateIdentity({expected: 'altiora/company', observations: observations(change)});
    assert.notEqual(result.status, 'IDENTITY_CONFIRMED_NOT_PUBLISH_AUTHORIZATION');
    assert.equal(result.exit_code, 2);
    assert.equal(result.publication_authorized, false);
  }
});

test('invalid expected target cannot masquerade as a match', () => {
  for (const expected of ['https://github.com/altiora/company', 'altiora/company.git', '../company',
    'owner/repo extra', 'a/b/c', '', null]) {
    const result = evaluateIdentity({expected, observations: observations()});
    assert.equal(result.status, 'TARGET_NOT_CONFIRMED');
  }
});

test('injected git probes are local, bounded, read-only and never expose raw errors or filenames', () => {
  const calls = [];
  const runner = (exe, args, options) => {
    calls.push(args);
    assert.equal(exe, 'git');
    assert.equal(options.shell, false);
    assert.ok(options.timeout > 0 && options.timeout <= 10000);
    assert.ok(args.includes('--no-optional-locks'));
    assert.ok(args.includes('core.fsmonitor=false'));
    if (args.includes('rev-parse')) return {status: 0, stdout: 'true\n'};
    if (args.includes('config')) return {status: 0, stdout: 'https://user:super-secret@github.com/altiora/company.git\n'};
    if (args.includes('symbolic-ref')) return {status: 0, stdout: 'feature/test\n'};
    return {status: 128, stderr: 'fatal: private-error-token /private/customer.env'};
  };
  const report = inspectProject({expected: 'altiora/company', runner});
  assert.equal(report.status, 'WORKTREE_CHECK_FAILED');
  assert.doesNotMatch(JSON.stringify(report), /super-secret|private-error-token|customer.env/);
  assert.equal(calls.length, 4);
  assert.ok(calls.every(args => !args.some(arg => ['push', 'fetch', 'checkout', 'add', 'commit'].includes(arg))));
});

test('process exceptions become bounded unknown observations, not leaked errors', () => {
  const result = inspectProject({expected: 'altiora/company', runner: () => {throw Error('private-value');}});
  assert.equal(result.status, 'WORKTREE_CHECK_FAILED');
  assert.doesNotMatch(JSON.stringify(result), /private-value/);
});
