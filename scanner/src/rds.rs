extern crate redis;

use std::env;

use dotenv::dotenv;
use redis::Commands;

pub(crate) fn save_process_cache(pid: u32, name: String) -> redis::RedisResult<()> {
    dotenv().ok();
    dotenv::from_filename("../../.env").ok();
    let url = dotenv::var("REDIS_URL").unwrap();
    let client = redis::Client::open(String::from(url))?;
    let mut con = client.get_connection().unwrap();
    con.set(pid, name)?;
    Ok(())
}
