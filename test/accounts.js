import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import api from '../'
import uuid from 'node-uuid'
import {signup} from './utils'
import r from '../utils/rdb'
import config from '../config'

chai.use(chaiHttp)
chai.use(chaiAsPromised)

let app = null
before((done) => {
  async () => {
    app = await api()
    done()
  }().catch(done)
})

after((done) => {
  async () => {
    await r.db(config.rethinkdb.db).table('accounts').delete()
    done()
  }().catch(done)
})

let username = 'username'
let password = 'password1'
describe('accounts', () => {
  it('/signup', () => {
    let request = chai.request(app.listen()).post('/signup').send({username, password})
    return expect(request).to.eventually.have.deep.property('body.accessToken')
  })

  it('/signup again should got 400', () => {
    let request = chai.request(app.listen()).post('/signup').send({username, password})
    return expect(request).to.eventually.have.status(400)
  })

  it('/login', () => {
    let request = chai.request(app.listen()).post('/login').send({username, password})
    return expect(request).to.eventually.have.status(200)
  })

  it('/logout', () => {
    let request = chai.request(app.listen()).get('/logout')
    return expect(request).to.eventually.have.status(200)
  })
})


