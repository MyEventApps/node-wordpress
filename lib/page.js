const fieldMap = require('./fields')

module.exports = {
  getPage: function(id, fields, cb) {
    if (typeof fields === 'function') {
      cb = fields
      fields = null
    }

    if (fields) {
      fields = fieldMap.array(fields, 'page')
    }

    this.authenticatedCall('wp.getPage', id, fields, (err, page) =>
      cb(err, !err && fieldMap.from(page, 'page'))
    )
  },

  getPages: function(filter, fields, cb) {
    if (typeof filter === 'function') {
      cb = filter
      fields = null
      filter = {}
    }

    if (typeof fields === 'function') {
      cb = fields
      fields = null
    }

    if (filter.type) {
      filter.page_type = filter.type
      delete filter.type
    }

    if (filter.status) {
      filter.page_status = filter.status
      delete filter.status
    }

    if (filter.orderby) {
      filter.orderby = fieldMap.array([filter.orderby], 'page')[0]
    }

    if (fields) {
      fields = fieldMap.array(fields, 'page')
    }

    this.authenticatedCall('wp.getPages', 1000, fields, (err, pages) =>
      cb(err, !err && pages.map(page => fieldMap.from(page, 'page')))
    )
  },

  newPage: function(data, cb) {
    this.authenticatedCall('wp.newPage', fieldMap.to(data, 'page'), cb)
  },

  // to remove a term, just set the terms and leave out the id that you want to remove
  // to remove a custom field, pass the id with no key or value
  editPage: function(id, data, cb) {
    delete data.id
    this.authenticatedCall('wp.editPage', id, fieldMap.to(data, 'page'), cb)
  },

  deletePage: function(id, cb) {
    this.authenticatedCall('wp.deletePage', id, cb)
  }
}
