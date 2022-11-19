extern crate redis;

use dotenv::dotenv;
use redis::Commands;

pub(crate) fn cache_single_proc(proc: json::object) -> redis::RedisResult<()> {
    dotenv().ok();
    dotenv::from_filename("../../.env").ok();
    let url = dotenv::var("REDIS_URL").unwrap();
    let client = redis::Client::open(String::from(url))?;
    let mut con = client.get_connection().unwrap();
    con.set(pid, name)?;
    println!("{} cached!", pid);
    Ok(())
}
