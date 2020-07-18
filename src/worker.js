const Promise = require('bluebird')

class Worker {
  constructor (config) {
    this.config = config
  }

  async start () {
    this.unlisten = this.config.listen(() => this._fetch())
    while (!this.stopped) {
      await this._fetch()
      await Promise.delay(this.config.interval)
    }
  }

  stop () {
    this.unlisten && this.unlisten()
    this.stopped = true
  }

  async _fetch () {
    await this.config.fetch().then(this.config.onFetch).catch(this.config.onError)
  }
}

module.exports = Worker
