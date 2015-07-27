export default function * errorDelegator (next) {
    try {
      yield next
    } catch (e) {
      this.status = e.status || 500
      this.body = {
        error: {
          name: e.name,
          status: e.status,
          message: e.message
        }
      }
      this.app.emit('error', e, this)
    }
}
