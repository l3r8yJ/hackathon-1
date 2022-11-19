#[cfg(windows)]
extern crate scanner;

use std::io::Error;

#[cfg(windows)]
use scanner::utils::ProcessInformationIterator;


#[cfg(windows)]
fn print_message() -> Result<i32, Error> {
        for process_information in ProcessInformationIterator::new() {
            println!("{}: {}", process_information.pid, process_information.name);
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
}