use neon::prelude::*;
use serde::{Deserialize, Serialize};

use libseccomp::*;

#[derive(Serialize, Deserialize)]
struct SeccompSyscalls {
    action: String,
    names: Vec<String>,
}
#[derive(Serialize, Deserialize)]
struct SeccompRules {
    defaultAction: String,
    syscalls: Vec<SeccompSyscalls>,
}

#[derive(Serialize, Deserialize)]
struct SeccompWrapper {
    seccomp: SeccompRules,
}

const EPERM: u32 = 1;
const ENOSYS: u32 = 38;

fn apply(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let json = cx.argument::<JsString>(0)?.value();
    let json_str = json.as_str();
    let scmp_rules: SeccompWrapper = serde_json::from_str(json_str).unwrap();

    let scmp_default_action =
        ScmpAction::from_str(&scmp_rules.seccomp.defaultAction, Some(EPERM)).unwrap();

    let mut scmp_ctx = ScmpFilterContext::new_filter(scmp_default_action).unwrap();
    scmp_ctx.add_arch(ScmpArch::X8664).unwrap();
    let syscalls = scmp_rules.seccomp.syscalls;

    let arch = Some(ScmpArch::X8664);

    for s in 0..syscalls.len() {
        let syscall = &syscalls[s];
        let syscall_action = if syscall.action == "allow" {
            ScmpAction::Allow
        } else {
            ScmpAction::Errno(ENOSYS)
        };

        for n in 0..syscall.names.len() {
            let name = &syscall.names[n];
            let syscall = get_syscall_from_name(&name, arch).unwrap();
            scmp_ctx.add_rule(syscall_action, syscall, None).unwrap();
        }
    }

    scmp_ctx.load().unwrap();
    Ok(cx.boolean(true))
}

register_module!(mut cx, { cx.export_function("apply", apply) });
