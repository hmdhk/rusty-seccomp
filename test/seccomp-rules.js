const seccompTemplate = {
    "seccomp": {
        /**
         * `SCMP_ACT_ERRNO`, `SCMP_ACT_LOG`
         */
        "defaultAction": "SCMP_ACT_ERRNO",
        "syscalls": []
    }
}

const baseRules = {
    "action": "allow",
    "names": [
        "read",
        "write",
        "open",
        "close",
        "stat",
        "fstat",
        "mmap",
        "mprotect",
        "munmap",
        "brk",
        "rt_sigaction",
        "rt_sigprocmask",
        "ioctl",
        "madvise",
        "fcntl",
        "readlink",
        "futex",
        "clock_gettime",
        "exit_group",
        "epoll_wait",
        "epoll_ctl",
        "dup3",
        "wait4",
    ]
}

/// child_process.spawn
const childProcessSpawn = {
    "action": "allow",
    "names": [
        "rt_sigreturn",
        "dup2",
        "recvmsg",
        "socketpair",
        "clone",
        "execve",
        "set_robust_list",
        "pipe2",
        "access",
        "getcwd",
        "arch_prctl"
    ]
}
//http.createServer
const httpServer = {
    "action": "allow",
    "names": [
        "lseek",
        "rt_sigreturn",
        "writev",
        "getpid",
        "socket",
        "shutdown",
        "bind",
        "listen",
        "setsockopt",
        "gettimeofday",
        "gettid",
        "tgkill",
        "accept4"
    ]
}

module.exports = {
    baseRules,
    childProcessSpawn,
    seccompTemplate,
    httpServer
}