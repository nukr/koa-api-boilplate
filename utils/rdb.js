import rethinkdbdash from 'rethinkdbdash'
import config from '../config'

export default rethinkdbdash({
  host: config.rethinkdb.host,
  port: config.rethinkdb.port,
  max: 300
})

