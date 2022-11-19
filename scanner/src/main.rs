#[cfg(windows)]
extern crate scanner;

use std::io::Error;

use sysinfo::{PidExt, ProcessExt, System, SystemExt};

use proc_entity::ProcessEntity;

#[cfg(windows)]
use crate::rds::cache_single_proc;

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
            cpu_usage: proc.1.cpu_usage(),
        }
    ).for_each(|ent| cache_single_proc(&ent).unwrap());
    Ok(0)
}

#[cfg(not(windows))]
fn print_message() -> Result<(), Error> {
    println!("Only works on Windows");
    Ok(())
}

fn main() {
    cache_all().unwrap();
}