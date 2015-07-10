import Router from 'koa-router';
import r from '../utils/rdb'
import config from '../config'
import parse from 'co-body'
import Debug from 'debug'
import uuid from 'node-uuid'
import hasher from '../utils/hasher'

let debug = Debug('api:accounts')
let router = Router();

router.post('/login', login)
router.get('/logout', logout)
router.post('/signup', signup)

function * login (next) {
  let body = yield parse.json(this)
  let {username, password} = body
  password = yield hasher(password)
  let result = yield r.db(config.rethinkdb.db).table('accounts').filter(username, password)

  if (result.length === 1) {
    this.body = {accessToken: result[0].accessToken}
  } else {
    this.status = 400
  }
  yield next
}

function * logout (next) {
  this.body = 'logout'
  yield next
}

function * signup (next) {
  let accessToken = uuid.v4()
  let body = yield parse.json(this)
  let users = yield r.db(config.rethinkdb.db).table('accounts').filter({username: body.username})
  if (users.length) return this.status = 400
  let result = yield r
  .db(config.rethinkdb.db)
  .table('accounts')
  .insert({
    username: body.username,
    password: yield hasher(body.password),
    accessToken
  })

  if (result.inserted) {
    let id = result.generated_keys[0]
    this.body = {id, accessToken}
  } else {
    this.status = 500
  }
  yield next
}

export default router.middleware()
