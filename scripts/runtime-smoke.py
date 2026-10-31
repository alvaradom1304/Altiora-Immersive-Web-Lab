#!/usr/bin/env python3
"""Exercise a reviewed local Altiora hook handler in synthetic fixture projects."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import threading

GUARD = '.altiora/system/scripts/guard.py'
MAX_FILE = 256 * 1024
MAX_OUTPUT = 16 * 1024
RUNTIMES = ('codex', 'claude', 'antigravity')


class InvalidSource(ValueError):
    pass


def safe_path(path, directory=False):
    path = Path(path)
    if not path.is_absolute():
        raise InvalidSource()
    for current in [path, *path.parents]:
        if current.is_symlink() or getattr(current, 'is_junction', lambda: False)():
            raise InvalidSource()
    info = path.stat()
    if directory:
        if not path.is_dir():
            raise InvalidSource()
    elif not path.is_file() or info.st_nlink != 1 or info.st_size > MAX_FILE:
        raise InvalidSource()
    return path.resolve()


def read_source(path):
    path = safe_path(path)
    with path.open('rb') as stream:
        content = stream.read(MAX_FILE + 1)
    if len(content) > MAX_FILE:
        raise InvalidSource()
    content.decode('utf-8-sig')
    return content


def validate_source(project):
    guard = project / GUARD
    if not guard.exists():
        return None
    source = read_source(guard)
    receipt = json.loads(read_source(project / '.altiora/installation.json').decode('utf-8-sig'))
    expected = receipt.get('managed', {}).get(GUARD)
    actual = hashlib.sha256(source).hexdigest()
    if not isinstance(expected, str) or not re.fullmatch(r'[a-f0-9]{64}', expected) or actual != expected:
        raise InvalidSource()
    policy = json.loads(read_source(project / '.altiora/policy.json').decode('utf-8-sig'))
    if not isinstance(policy, dict):
        raise InvalidSource()
    for field in ['protected_names', 'allowed_names']:
        if not isinstance(policy.get(field), list) or not all(isinstance(x, str) and x for x in policy[field]):
            raise InvalidSource()
    if not policy['protected_names']:
        raise InvalidSource()
    return source, actual, policy


def case_payload(runtime, name):
    if name == 'session_start':
        return 'SessionStart', '{}'
    if name == 'invalid_json':
        return 'PreToolUse', '{'
    if name == 'invalid_object':
        return 'PreToolUse', '[]'
    filename = {'normal_edit': 'notes.txt', 'protected_edit': '.env', 'allowed_example': '.env.example'}[name]
    if runtime == 'codex':
        value = {'tool_name': 'apply_patch', 'tool_input': {'command': '*** Begin Patch\n*** Add File: ' + filename + '\n+fixture\n*** End Patch\n'}}
    elif runtime == 'claude':
        value = {'tool_name': 'Write', 'tool_input': {'file_path': filename, 'content': 'fixture'}}
    else:
        value = {'toolCall': {'name': 'write_to_file', 'args': {'TargetFile': filename, 'CodeContent': 'fixture'}}}
    return 'PreToolUse', json.dumps(value)


def limited_process(command, payload, cwd, timeout):
    """Bound output while running; never retain or return raw child diagnostics."""
    allowed_env = ('SYSTEMROOT', 'WINDIR', 'TEMP', 'TMP', 'PATH', 'LANG', 'LC_ALL')
    environment = {key: os.environ[key] for key in allowed_env if key in os.environ}
    kwargs = {'cwd': cwd, 'env': environment, 'stdin': subprocess.PIPE,
              'stdout': subprocess.PIPE, 'stderr': subprocess.PIPE, 'shell': False}
    if os.name == 'nt':
        kwargs['creationflags'] = subprocess.CREATE_NO_WINDOW
    process = subprocess.Popen(command, **kwargs)
    output, errors = bytearray(), bytearray()
    exceeded = threading.Event()
    lock = threading.Lock()

    def consume(pipe, destination):
        try:
            while True:
                chunk = pipe.read(4096)
                if not chunk:
                    break
                with lock:
                    if len(output) + len(errors) + len(chunk) > MAX_OUTPUT:
                        exceeded.set()
                        process.kill()
                        break
                    destination.extend(chunk)
        except (OSError, ValueError):
            pass

    readers = [threading.Thread(target=consume, args=(process.stdout, output), daemon=True),
               threading.Thread(target=consume, args=(process.stderr, errors), daemon=True)]
    for reader in readers:
        reader.start()
    reason = None
    try:
        process.stdin.write(payload.encode('utf-8'))
        process.stdin.close()
        process.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        reason = 'TIMEOUT'
        process.kill()
        process.wait(timeout=2)
    except (OSError, BrokenPipeError):
        reason = 'PROCESS_FAILED'
        process.kill()
        process.wait(timeout=2)
    finally:
        for reader in readers:
            reader.join(timeout=1)
        if not process.stdin.closed:
            process.stdin.close()
        for pipe in [process.stdout, process.stderr]:
            pipe.close()
    if exceeded.is_set():
        reason = 'OUTPUT_LIMIT'
    if reason:
        return None, reason
    if process.returncode != 0:
        return None, 'PROCESS_FAILED'
    try:
        value = json.loads(bytes(output).decode('utf-8-sig'))
        if not isinstance(value, dict):
            raise ValueError()
    except (ValueError, UnicodeError):
        return None, 'INVALID_RESPONSE'
    return value, None


def passed_case(runtime, name, value):
    if not isinstance(value, dict):
        return False
    if runtime == 'codex' and name != 'session_start' and any(
            field in value for field in ['continue', 'stopReason', 'suppressOutput']):
        # Codex treats these unsupported PreToolUse fields as hook failure,
        # even when a plausible denial is present beside them.
        return False
    if name == 'session_start':
        if runtime in {'codex', 'claude'} and (
                value.get('continue', True) is not True or 'stopReason' in value):
            return False
        if runtime == 'antigravity':
            steps = value.get('injectSteps')
            return (isinstance(steps, list) and len(steps) > 0
                    and all(isinstance(s, dict) and isinstance(s.get('systemMessage'), dict)
                            and isinstance(s['systemMessage'].get('systemMessage'), str)
                            and s['systemMessage']['systemMessage'].strip() for s in steps))
        hook = value.get('hookSpecificOutput', {})
        return (isinstance(hook, dict) and hook.get('hookEventName') == 'SessionStart'
                and isinstance(hook.get('additionalContext'), str) and bool(hook['additionalContext'].strip()))
    denial = name in {'protected_edit', 'invalid_json', 'invalid_object'}
    if runtime == 'antigravity':
        if denial:
            return value.get('decision') == 'deny' and isinstance(value.get('reason'), str) and bool(value['reason'].strip())
        return value == {'decision': 'allow'}
    if not denial:
        return value == {}  # A smoke pass must not grant approval.
    hook = value.get('hookSpecificOutput', {})
    return (isinstance(hook, dict) and hook.get('hookEventName') == 'PreToolUse'
            and hook.get('permissionDecision') == 'deny'
            and isinstance(hook.get('permissionDecisionReason'), str) and bool(hook['permissionDecisionReason'].strip()))


def run_smoke(project, scratch_root, *, timeout=5.0):
    report = {'schema_version': 1, 'report_type': 'isolated_runtime_adapter_smoke',
              'observed_at': datetime.now(timezone.utc).isoformat(), 'status': 'SOURCE_NOT_VERIFIED',
              'executed_cases': 0, 'expected_cases': 18, 'runtimes': [],
              'native_discovery': 'NOT_VERIFIED', 'native_trust': 'NOT_VERIFIED',
              'unsupported_coverage': [{'kind': x, 'state': 'NOT_COVERED'} for x in ['shell', 'arbitrary_MCP', 'unknown_tools']],
              'limits': ['Executes only the reviewed installed guard with synthetic inputs; no native AI session or model call.',
                         'Receipt hash is an integrity check, not a security audit. Use only owner-controlled, previously reviewed kits.',
                         'Does not read real secret files/transcripts, execute configured command strings, change live policy or grant trust.',
                         'Temporary fixtures are not a child-process security sandbox. Passing does not prove host hook loading or permissions.']}
    try:
        project = safe_path(Path(project), directory=True)
        scratch_root = safe_path(Path(scratch_root), directory=True)
        if not isinstance(timeout, (float, int)) or isinstance(timeout, bool) or not 0.05 <= timeout <= 10:
            raise InvalidSource()
    except (OSError, ValueError):
        report['status'] = 'UNSAFE_LOCATION'
        return report
    try:
        source = validate_source(project)
    except (OSError, ValueError, TypeError, AttributeError):
        return report
    if source is None:
        report['status'] = 'KIT_NOT_PRESENT'
        return report
    guard_bytes, expected_hash, policy = source
    report['guard_sha256'] = expected_hash
    fixture = Path(tempfile.mkdtemp(prefix='altiora-runtime-smoke-', dir=scratch_root))
    try:
        if not fixture.resolve().is_relative_to(scratch_root):
            raise InvalidSource()
        (fixture / '.altiora').mkdir()
        (fixture / '.altiora/policy.json').write_text(json.dumps(policy), encoding='utf-8')
        guard = fixture / 'reviewed-guard.py'
        # Run exactly the bytes whose receipt hash passed, not a mutable source path.
        guard.write_bytes(guard_bytes)
        abort = False
        for runtime in RUNTIMES:
            rows = []
            result = {'runtime': runtime, 'adapter_function': 'NOT_RUN', 'native_session': 'NOT_VERIFIED', 'cases': rows}
            report['runtimes'].append(result)
            if abort:
                continue
            for name in ['session_start', 'normal_edit', 'protected_edit', 'allowed_example', 'invalid_json', 'invalid_object']:
                # Recheck the isolated copy immediately before each launch.
                if hashlib.sha256(read_source(guard)).hexdigest() != expected_hash:
                    rows.append({'name': name, 'status': 'FAIL', 'reason': 'SOURCE_CHANGED'})
                    abort = True
                    break
                event, payload = case_payload(runtime, name)
                command = [sys.executable, '-I', '-B', str(guard), '--runtime', runtime,
                           '--project', str(fixture), '--event', event]
                value, error = limited_process(command, payload, fixture, timeout)
                report['executed_cases'] += 1
                passed = error is None and passed_case(runtime, name, value)
                rows.append({'name': name, 'status': 'PASS' if passed else 'FAIL',
                             'reason': 'EXPECTED_RESPONSE' if passed else error or 'UNEXPECTED_DECISION'})
                if error:
                    abort = True
                    break
            result['adapter_function'] = 'PASS' if len(rows) == 6 and all(r['status'] == 'PASS' for r in rows) else 'FAIL'
        report['status'] = 'PASS' if all(r['adapter_function'] == 'PASS' for r in report['runtimes']) else 'FAIL'
    except (OSError, ValueError, TypeError, AttributeError, subprocess.SubprocessError):
        report['status'] = 'FAIL'
        report['failure'] = 'ISOLATED_CHECK_FAILED'
    finally:
        # Check the resolved target is the newly created direct child before recursion.
        actual = safe_path(fixture, directory=True)
        if actual.parent != scratch_root or not actual.name.startswith('altiora-runtime-smoke-'):
            raise InvalidSource('Unsafe cleanup refused')
        shutil.rmtree(actual)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', type=Path, required=True, help='Absolute trusted project with reviewed kit')
    parser.add_argument('--scratch-root', type=Path, required=True, help='Existing absolute owner-controlled temporary workspace')
    args = parser.parse_args()
    report = run_smoke(args.project, args.scratch_root)
    print(json.dumps(report, ensure_ascii=True, indent=2))
    return 0 if report['status'] == 'PASS' else 2


if __name__ == '__main__':
    sys.exit(main())
