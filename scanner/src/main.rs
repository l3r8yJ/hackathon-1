#[cfg(windows)]
extern crate scanner;

use std::io::Error;

use sysinfo::{PidExt, ProcessExt, System, SystemExt};

#[cfg(windows)]
use crate::rds::save_process_cache;

mod rds;

#[cfg(windows)]
fn cache_all() -> Result<i32, Error> {
    let s = System::new_all();
    let all = s.processes();
    all.iter().for_each(
        |proc| save_process_cache(proc.1.pid().as_u32(), proc.1.name().to_string()).unwrap()
    );
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