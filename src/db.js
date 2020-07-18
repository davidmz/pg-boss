const EventEmitter = require('events')
const pg = require('pg')

class Db extends EventEmitter {
  constructor (config) {
    super()

    config.application_name = config.application_name || 'pgboss'

    this.config = config
  }

  async open () {
    this.pool = new pg.Pool(this.config)
    this.pool.on('error', error => this.emit('error', error))
    this.pool.on('connect', client => {
      client.query('LISTEN pgboss')
      client.on('notification', m => this.emit('job', m.payload))
    })
    this.opened = true
  }

  async close () {
    if (!this.pool.ending) {
      await this.pool.end()
      this.opened = false
    }
  }

  async executeSql (text, values) {
    return this.pool.query(text, values)
  }
}

module.exports = Db
