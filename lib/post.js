const fieldMap = require('./fields')

module.exports = {
  getPost: function(id, fields, cb) {
    if (typeof fields === 'function') {
      cb = fields
      fields = null
    }

    if (fields) {
      fields = fieldMap.array(fields, 'post')
    }

    this.authenticatedCall('wp.getPost', id, fields, (err, post) =>
      cb(err, !err && fieldMap.from(post, 'post'))
    )
  },

  getPosts: function(filter, fields, cb) {
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
      filter.post_type = filter.type
      delete filter.type
    }

    if (filter.status) {
      filter.post_status = filter.status
      delete filter.status
    }

    if (filter.orderby) {
      filter.orderby = fieldMap.array([filter.orderby], 'post')[0]
    }

    if (fields) {
      fields = fieldMap.array(fields, 'post')
    }

    this.authenticatedCall('wp.getPosts', filter, fields, (err, posts) =>
      cb(err, !err && posts.map(post => fieldMap.from(post, 'post')))
    )
  },

  newPost: function(data, cb) {
    this.authenticatedCall('wp.newPost', fieldMap.to(data, 'post'), cb)
  },

  // to remove a term, just set the terms and leave out the id that you want to remove
  // to remove a custom field, pass the id with no key or value
  editPost: function(id, data, cb) {
    this.authenticatedCall('wp.editPost', id, fieldMap.to(data, 'post'), cb)
  },

  deletePost: function(id, cb) {
    this.authenticatedCall('wp.deletePost', id, cb)
  },

  getPostType: function(name, fields, cb) {
    if (typeof fields === 'function') {
      cb = fields
      fields = null
    }

    if (fields) {
      fields = fieldMap.array(fields, 'postType')
    }

    this.authenticatedCall('wp.getPostType', name, fields, (err, postType) =>
      cb(err, !err && fieldMap.from(postType, 'postType'))
    )
  },

  getPostTypes: function(filter, fields, cb) {
    if (typeof filter === 'function') {
      cb = filter
      fields = null
      filter = {}
    }

    if (typeof fields === 'function') {
      cb = fields
      fields = null
    }

    if (Array.isArray(filter)) {
      fields = filter
      filter = {}
    }

    if (fields) {
      fields = fieldMap.array(fields, 'postType')
    }

    this.authenticatedCall(
      'wp.getPostTypes',
      filter,
      fields,
      (err, postTypes) =>
        cb(
          err,
          !err &&
            Object.keys(postTypes).reduce((result, postType) => {
              result[postType] = fieldMap.from(postTypes[postType], 'postType')
              return result
            }, {})
        )
    )
  }
}
