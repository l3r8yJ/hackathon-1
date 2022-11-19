extern crate redis;

use redis::Commands;

pub(crate) fn save_process_cache(pid: u32, name: String) -> redis::RedisResult<()> {
    let client = redis::Client::open("redis://127.0.0.1/")?;
    let mut con = client.get_connection().unwrap();
    con.set(pid, name)?;
    println!("qqqqqq");
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::rds::save_process_cache;

    fn test_save_process_success() {
        assert_eq!(
            save_process_cache(324123, String.from("SomeStr")),
            Ok(())
        );
    }
}
