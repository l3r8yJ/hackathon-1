#[cfg(windows)]
extern crate scanner;

use std::io::Error;

#[cfg(windows)]
use scanner::utils::ProcessInformationIterator;

use crate::rds::save_process_cache;

mod rds;

#[cfg(windows)]
fn print_message() -> Result<i32, Error> {
    for process_information in ProcessInformationIterator::new() {
        println!("{}: {}: {}: {}",
                 process_information.pid,
                 process_information.name,
                 process_information.size,
                 process_information.usage
        );
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