let env = process.env.NODE_ENV || 'development'
let dbName = null

export default {
  rethinkdb: {
    host: 'localhost',
    port: 28015,
    db: `texas_holdem_${env}`,
    max: 300
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  koa: {
    port: 14444
  }
}
