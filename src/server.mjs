import express from 'express'
import {allCached} from "./cache.mjs";
const app = express()

export function serverInstance() {
  app.get('/cache', function (req, res) {
    allCached().then(data => {
      console.log(data)
      res.header("Application/json")
      .send(data)
    })
  })

  app.listen(3031, "localhost",(req, res) => {
    console.log('Server raised!')
  })
}
