extern crate winapi;

use winapi::um::handleapi::INVALID_HANDLE_VALUE;
use winapi::um::tlhelp32::{CreateToolhelp32Snapshot, LPPROCESSENTRY32, Process32First, Process32Next, PROCESSENTRY32, TH32CS_SNAPPROCESS};
use winapi::um::winnt::HANDLE;

pub struct ProcessInformation {
    pub pid: u32,
    pub name: String,
    pub size: u32,
    pub usage: u32,
}

impl ProcessInformation {
    fn new(_pid: u32, _name: String, _size: u32, _usage: u32) -> ProcessInformation {
        ProcessInformation { pid: _pid, name: _name, size: _size, usage: _usage }
    }
}

pub struct ProcessInformationIterator {
    process_information: ProcessInformation,
    index: usize,
    process_snapshot: HANDLE,
    process_entry: PROCESSENTRY32,
}

fn char_arr_to_string(chars  : &[i8]) -> String {
    chars.into_iter().map(|c| { *c as u8 as char }).collect()
}

impl ProcessInformationIterator {
    pub fn new() -> ProcessInformationIterator {
        let h_process_snapshot: HANDLE = unsafe {
            CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0)
        };
        if h_process_snapshot == INVALID_HANDLE_VALUE {
            panic!("Invalid handle value");
        }
        println!("Got process snapshot handle, moving on...");
        let mut pe: PROCESSENTRY32;
        unsafe {
            pe = std::mem::zeroed();
        }
        let a = std::mem::size_of::<PROCESSENTRY32>();
        let lppe: LPPROCESSENTRY32 = &mut pe;
        pe.dwSize = a as u32;
        let res = unsafe { Process32First(h_process_snapshot, lppe) };
        if res == 0 {
            panic!("Can't get process list");
        }
        let pid: u32 = pe.th32ProcessID;
        let process_name: String = char_arr_to_string(&pe.szExeFile);
        let size: u32 = pe.dwSize;
        let usage: u32 = pe.cntUsage;
        ProcessInformationIterator {
            process_information: ProcessInformation::new(pid, process_name, size, usage),
            index: 0,
            process_snapshot: h_process_snapshot,
            process_entry: pe
        }
    }
}

impl Iterator for ProcessInformationIterator {
    type Item = ProcessInformation;
    fn next(&mut self) -> Option<<Self as Iterator>::Item> {
        self.index = self.index + 1;
        if self.index == 1 {
            return Some(
                ProcessInformation::new(
                    self.process_information.pid,
                    self.process_information.name.clone(),
                    self.process_information.size,
                    self.process_information.usage
                )
            );
        }
        let mut pe = self.process_entry;
        let lppe = &mut pe;
        let res;
        unsafe {
            (*lppe).szExeFile = std::mem::zeroed();
            res = Process32Next(self.process_snapshot, lppe);
        }
        if res != 1 { // No more processes, finish the iteration
            None
        } else {
            let pid: u32 = (*lppe).th32ProcessID;
            let process_name: String = char_arr_to_string(&(*lppe).szExeFile);
            let size: u32 = (*lppe).dwSize;
            let usage: u32 = (*lppe).cntUsage;
            Some(ProcessInformation::new(pid, process_name, size, usage))
        }
    }
}