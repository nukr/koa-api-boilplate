import Redis from 'ioredis'
import Debug from 'debug'
import config from '../config'
import r from './rdb'

let debug = Debug('meepcloud:verifyToken')

const redis = new Redis(config.redis.port, config.redis.host)

export default function * (next) {
  let token = this.header['x-meepcloud-access-token']
  if (typeof token !== 'undefined') {
    let user = yield r.db(config.rethinkdb.db).table('accounts').filter({accessToken: token})
    this.meepcloudUserId = user[0].id
  }
  yield next
}
