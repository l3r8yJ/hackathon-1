extern crate redis;

use redis::Commands;

fn save_process_cache(pid: u32, name: String) -> redis::RedisResult<()> {
    let client = redis::Client::open("redis://127.0.0.1/")?;
    let mut con = client.get_connection().unwrap();
    con.set(pid, name)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::rds::save_process_cache;
    fn save_p_test() {
        assert_eq!(
            save_process_cache(324123, String.from("SomeStr")),
            Ok(())
        );
    }
}
