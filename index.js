import koa from 'koa'
import Redis from 'ioredis'
import logger from 'koa-logger'
import responseTime from 'koa-response-time'
import config from './config'
import routes from './routes'
import cors from 'koa-cors'
import verifyToken from './utils/verifyToken'
import r from './utils/rdb'
import Ensure from 'rethink-ensure'
import errorHandler from './utils/errorHandler'
import errorDelegator from './utils/errorDelegator'
import ratelimit from 'koa-ratelimit'

let ensure = new Ensure(r)

let env = process.env.NODE_ENV || 'development'

export default async (opts) => {
  await ensure.db(config.rethinkdb.db)
  await ensure.table(config.rethinkdb.db, 'accounts')

  opts = opts || {}
  let app = koa()

  if (env !== 'test') {
    app.on('error', errorHandler)
    app.use(logger())
    app.use(ratelimit({
      db: new Redis(config.redis.port, config.redis.host),
      max: 2500,
      duration: 3600000,
      id: function (context) {
        return context.ip
      }
    }))
  }
  app.use(errorDelegator)
  app.use(responseTime())
  app.use(verifyToken)
  app.use(cors())
  app.use(routes)

  return app
}
