const fieldMap = require('./fields')

module.exports = {
  getMediaItem: function(id, cb) {
    this.authenticatedCall(
      'wp.getMediaItem',
      id,
      (err, media) => (err ? cb(err) : cb(null, fieldMap.from(media, 'media')))
    )
  },

  getMediaLibrary: function(filter, cb) {
    if (typeof filter === 'function') {
      cb = filter
      filter = {}
    }

    this.authenticatedCall(
      'wp.getMediaLibrary',
      filter,
      (err, media) =>
        err
          ? cb(err)
          : cb(null, media.map(item => fieldMap.from(item, 'media')))
    )
  },

  uploadFile: function(data, cb) {
    this.authenticatedCall('wp.uploadFile', fieldMap.to(data, 'file'), cb)
  }
}
