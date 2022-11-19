use serde::{Deserialize, Serialize};

#[derive(Debug,  Serialize, Deserialize)]
pub struct ProcessEntity {
    pub pid: u32,
    pub name: String,
    pub root: String,
    pub mem: u64,
    pub status: String,
    pub start_time: u64,
    pub run_time: u64,
    pub cpu_usage: f32
}

pub struct SystemEntity {
    pub global_cpu_usage: f32,
    pub global_mem: u64
}
