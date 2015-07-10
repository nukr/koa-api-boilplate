import koa from 'koa';
import Debug from 'debug'
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import config from './config';
import routes from './routes';
import cors from 'koa-cors';
import verifyToken from './utils/verifyToken'
import r from './utils/rdb'
import Ensure from 'rethink-ensure'

let ensure = new Ensure(r)

function errorHandler (err, ctx) {
  this.body = err
}

let debug = Debug('meepcloud:app')
let env = process.env.NODE_ENV || 'development'

export default async (opts) => {
  await ensure.db(config.rethinkdb.db)
  await ensure.table(config.rethinkdb.db, 'accounts')
  opts = opts || {}
  let app = koa();

  if (env !== 'test') app.use(logger())
  app.use(responseTime())
  app.use(verifyToken)
  app.use(cors())
  app.use(routes)
  app.on('error', errorHandler)

  return app
}
