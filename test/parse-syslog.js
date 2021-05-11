/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const syscallTable = require('./x86_64_table.json');

const syslogFile = process.argv[2] || './syslog';

console.log(`# Seccomp profile generated from ${syslogFile}`);
console.log(`
seccomp:
  default_action: errno
  syscalls:
`);
const data = fs.readFileSync(syslogFile, 'UTF-8');
const lines = data.split(/\r?\n/);

const parseLine = line => {
  const tuples = line.split(' ');
  const log = {};
  tuples.forEach(tuple => {
    const parts = tuple.split('=');
    log[parts[0]] = parts[1];
  });
  return log;
};

const seccomp = {};

lines.forEach(line => {
  const { syscall, exe } = parseLine(line);
  if (syscall && exe) {
    if (!seccomp[exe]) {
      seccomp[exe] = {};
    }
    if (!seccomp[exe][syscall]) {
      seccomp[exe][syscall] = syscallTable[syscall] || syscall;
    }
  }
});

const jsonFormat = {
  seccomp: {
    defaultAction: "SCMP_ACT_ERRNO",
    syscalls: [
      {
        action: "allow",
        names: [

        ]
      }
    ]
  }
}

for (const key in seccomp) {
  if (seccomp.hasOwnProperty(key)) {
    const syscalls = seccomp[key];
    console.log(`  - \n  # ${key}`);
    console.log(`    action: allow`);
    console.log(`    names:`);
    for (const k in syscalls) {
      if (syscalls.hasOwnProperty(k)) {
        const syscall = syscalls[k];
        jsonFormat.seccomp.syscalls[0].names.push(syscall)
        console.log(`    - ${syscall} #${k}`);
      }
    }
  }
}

console.log('json:', JSON.stringify(jsonFormat, undefined, 2))

