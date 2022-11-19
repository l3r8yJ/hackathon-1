#[cfg(windows)]
extern crate scanner;

use std::io::Error;

use sysinfo::{Pid, PidExt, ProcessExt, System, SystemExt};

#[cfg(windows)]
use scanner::utils::ProcessInformationIterator;

use crate::rds::save_process_cache;

mod rds;

#[cfg(windows)]
fn print_message() -> Result<i32, Error> {
    let s = System::new();
    for p_info in ProcessInformationIterator {
        if let Some(process) = s.process(Pid::from(p_info.pid)) {
            println!("{} {}", process.pid(), process.memory())
        }
    }
    Ok(0)
}

#[cfg(not(windows))]
fn print_message() -> Result<(), Error> {
    println!("Only works on Windows");
    Ok(())
}

fn main() {
    print_message().unwrap();
    save_process_cache(324123, String::from("SomeStr")).expect("Error");
}