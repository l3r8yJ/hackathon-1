import Redis from 'ioredis';

function client() {
  return new Redis({
    host: process.env.REDDIS_HOST,
    port: process.env.REDDIS_PORT,
  });
}
export const toCache = async (name, id) => {
  client().set(id, name).then(
      () => console.log("cached: %d\n", id)
  )
}

export const deleteFromCache = async (id) => {
  client().del(id).catch(err => console.error(err))
}

export const allCached = async () => {
  return client().keys('*', (err, res) => {
    if (err) {
      console.error(err)
      return
    }
    return res
  })
}
