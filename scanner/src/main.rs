#[cfg(windows)]
extern crate scanner;

use std::{thread, time};
use std::io::Error;

use sysinfo::{CpuExt, CpuRefreshKind, PidExt, ProcessExt, RefreshKind, System, SystemExt};

use proc_entity::ProcessEntity;

use crate::proc_entity::SystemEntity;
#[cfg(windows)]
use crate::rds::cache_single_proc;
use crate::rds::cache_system_usage;

mod rds;
mod proc_entity;

#[cfg(windows)]
fn cache_all() -> Result<i32, Error> {
    let s = System::new_all();
    let all = s.processes();
    all.iter().map(
        |proc| ProcessEntity {
            pid: proc.1.pid().as_u32(),
            name: proc.1.name().to_string(),
            root: proc.1.root().display().to_string(),
            mem: proc.1.memory(),
            status: proc.1.status().to_string(),
            start_time: proc.1.start_time(),
            run_time: proc.1.run_time(),
            cpu_usage: proc.1.cpu_usage()
        }
    ).for_each(|ent| cache_single_proc(&ent).unwrap());
    Ok(0)
}

#[cfg(windows)]
fn get_global_system_usage() -> Result<i32, Error> {
    let s = System::new_all();
    let ent = SystemEntity {
        global_cpu_usage: get_cpu_info(),
        global_mem: s.used_memory()
    };
    cache_system_usage(&ent).unwrap();
    Ok(0)
}

#[cfg(windows)]
fn get_cpu_info() -> f32 {
    let mut sys = System::new_with_specifics(
        RefreshKind::new().with_cpu(CpuRefreshKind::everything()),
    );
    let two_hundred_millis = time::Duration::from_millis(205);
    thread::sleep(two_hundred_millis);
    sys.refresh_cpu();
    thread::sleep(two_hundred_millis);
    sys.refresh_cpu();
    return sys.global_cpu_info().cpu_usage();
}

#[cfg(not(windows))]
fn print_message() -> Result<(), Error> {
    println!("Only works on Windows");
    Ok(())
}

fn main() {
    get_global_system_usage().unwrap();
    cache_all().unwrap();
}