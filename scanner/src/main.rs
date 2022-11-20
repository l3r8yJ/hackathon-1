#[cfg(windows)]
extern crate scanner;

use std::{thread, time};
use std::collections::hash_map::Iter;
use std::io::Error;
use std::iter::Map;

use actix_cors::Cors;
use actix_web::{App, http, HttpRequest, HttpServer, Responder, web};
use actix_web::error::ParseError::Method;
use serde_json::Value;
use sysinfo::{CpuExt, CpuRefreshKind, Pid, PidExt, Process, ProcessExt, RefreshKind, System, SystemExt};

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

async fn all_processes() -> String {
    let s = System::new_all();
    let all = s.processes();
    let t =  all.iter().map(
        |proc| serde_json::json!(ProcessEntity {
            pid: proc.1.pid().as_u32(),
            name: proc.1.name().to_string(),
            root: proc.1.root().display().to_string(),
            mem: proc.1.memory(),
            status: proc.1.status().to_string(),
            start_time: proc.1.start_time(),
            run_time: proc.1.run_time(),
            cpu_usage: proc.1.cpu_usage()
        }).to_string()
    );
    let mut sum = String::from("");
    t.for_each(|st| sum += &*st);
    return sum;
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

async fn all_as_json(req: HttpRequest) -> impl Responder {
    let all = all_processes().await;
    format!("{}", &all)
}

async fn system_usage_as_json(req: HttpRequest) -> impl Responder {
    let s = System::new_all();
    let ent = SystemEntity {
        global_cpu_usage: get_cpu_info(),
        global_mem: s.used_memory()
    };
    let as_json = serde_json::json!(ent);
    format!("{}", as_json)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::permissive();
        App::new()
            .route("/processes", web::get().to(all_as_json))
            .route("/usage", web::get().to(system_usage_as_json))
            .wrap(cors)
            // .service(index)
    }
    )
        .bind(("127.0.0.1", 8282))?
        .run()
        .await
}
