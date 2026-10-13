import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendRoot = path.join(projectRoot, 'backend');
const backendJar = path.join(backendRoot, 'target', 'venuevista-backend-0.1.0-SNAPSHOT.jar');
const isWindows = process.platform === 'win32';
const children = [];
let stopping = false;

function stopAll(signal = 'SIGINT') {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode !== null || child.signalCode !== null) continue;
    try {
      if (!isWindows && child.pid) process.kill(-child.pid, signal);
      else child.kill(signal);
    } catch {
      child.kill(signal);
    }
  }
}

function start(name, command, args, cwd) {
  console.log(`Starting ${name}...`);
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows,
    detached: !isWindows,
  });
  children.push(child);
  child.on('error', (error) => {
    console.error(`${name} could not start: ${error.message}`);
    process.exitCode = 1;
    stopAll();
  });
  child.on('exit', (code, signal) => {
    if (stopping) return;
    if (code !== 0) {
      console.error(`${name} stopped${signal ? ` after ${signal}` : ` with exit code ${code}`}.`);
      process.exitCode = code ?? 1;
    }
    stopAll();
  });
  return child;
}

process.on('SIGINT', () => stopAll('SIGINT'));
process.on('SIGTERM', () => stopAll('SIGTERM'));

async function backendIsReady() {
  try {
    const response = await fetch('http://127.0.0.1:8080/api/health', {
      signal: AbortSignal.timeout(1200),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const backendReady = await backendIsReady();
if (stopping) process.exit(0);

if (backendReady) {
  console.log('Backend API is already running at http://localhost:8080; reusing it.');
} else {
  const mavenCheck = spawnSync(isWindows ? 'where.exe' : 'which', [isWindows ? 'mvn.cmd' : 'mvn'], {
    stdio: 'ignore',
  });

  if (mavenCheck.status === 0) {
    start('backend API', isWindows ? 'mvn.cmd' : 'mvn', ['spring-boot:run'], backendRoot);
  } else if (existsSync(backendJar)) {
    console.warn('Maven is not on PATH; starting the existing backend package.');
    start('backend API', 'java', ['-jar', backendJar], backendRoot);
  } else {
    console.error('Backend could not start: install Maven or build the backend JAR first.');
    process.exitCode = 1;
    stopAll();
  }
}

start('frontend', isWindows ? 'npm.cmd' : 'npm', ['run', 'dev:server'], path.join(projectRoot, 'frontend'));
