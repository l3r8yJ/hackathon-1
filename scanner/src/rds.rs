extern crate redis;

use dotenv::dotenv;
use redis::{Commands, Connection};

use crate::proc_entity::{ProcessEntity, SystemEntity};

fn cache_preparation() -> Connection {
    dotenv().ok();
    dotenv::from_filename("../../.env").ok();
    let url = dotenv::var("REDIS_URL").unwrap();
    let client = redis::Client::open(String::from(url))?;
    return client.get_connection().unwrap();
}

pub(crate) fn cache_single_proc(proc: &ProcessEntity) -> redis::RedisResult<()> {
    let as_json = serde_json::json!(proc);
    let mut con = cache_preparation();
    con.set(proc.pid, as_json.to_string())?;
    println!("{} cached!", as_json.to_string());
    Ok(())
}

pub(crate) fn cache_system_usage(sys: &SystemEntity) -> redis::RedisResult<()> {
    let as_json = serde_json::json!(sys);
    let mut con = cache_preparation();
    con.set(proc.pid, as_json.to_string())?;
    println!("{} cached!", as_json.to_string());
    Ok(())
}
