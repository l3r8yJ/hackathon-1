import express from 'express'
import {allCached} from "./cache.mjs";

const app = express()

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};

export function serverInstance() {
  app.use(allowCrossDomain);
  app.get('/cache', function (req, res) {
    allCached().then(data => {
      res.header("Application/json")
      .send(data)
    })
  })

  app.listen(3031, "localhost",(req, res) => {
    console.log('Server raised!')
  })
}
