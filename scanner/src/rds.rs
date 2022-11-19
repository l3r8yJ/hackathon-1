extern crate redis;

use dotenv::dotenv;
use redis::Commands;

use crate::proc_entity::ProcessEntity;

pub(crate) fn cache_single_proc(proc: &ProcessEntity) -> redis::RedisResult<()> {
    let as_json = serde_json::json!(proc);
    dotenv().ok();
    dotenv::from_filename("../../.env").ok();
    let url = dotenv::var("REDIS_URL").unwrap();
    let client = redis::Client::open(String::from(url))?;
    let mut con = client.get_connection().unwrap();
    con.set(proc.pid, as_json.to_string())?;
    println!("{} cached!", as_json.to_string());
    Ok(())
}
