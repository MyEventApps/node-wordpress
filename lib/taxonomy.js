const fieldMap = require('./fields')

module.exports = {
  getTaxonomy: function(name, cb) {
    this.authenticatedCall('wp.getTaxonomy', name, (err, taxonomy) =>
      cb(err, !err && fieldMap.from(taxonomy, 'taxonomy'))
    )
  },

  getTaxonomies: function(cb) {
    this.authenticatedCall('wp.getTaxonomies', (err, taxonomies) =>
      cb(
        err,
        !err &&
          taxonomies.map(function(taxonomy) {
            return fieldMap.from(taxonomy, 'taxonomy')
          })
      )
    )
  },

  getTerm: function(taxonomy, id, cb) {
    this.authenticatedCall('wp.getTerm', taxonomy, id, (err, term) =>
      cb(err, !err && fieldMap.from(term, 'term'))
    )
  },

  getTerms: function(taxonomy, filter, cb) {
    if (typeof filter === 'function') {
      cb = filter
      filter = {}
    }

    if (filter.hideEmpty) {
      filter.hide_empty = filter.hideEmpty
      delete filter.hideEmpty
    }

    if (filter.orderby) {
      filter.orderby = fieldMap.array([filter.orderby], 'term')[0]
    }

    this.authenticatedCall('wp.getTerms', taxonomy, filter, (err, terms) =>
      cb(err, !err && terms.map(term => fieldMap.from(term, 'term')))
    )
  },

  newTerm: function(data, cb) {
    this.authenticatedCall('wp.newTerm', fieldMap.to(data, 'term'), cb)
  },

  editTerm: function(id, data, cb) {
    this.authenticatedCall('wp.editTerm', id, fieldMap.to(data, 'term'), cb)
  },

  deleteTerm: function(taxonomy, id, cb) {
    this.authenticatedCall('wp.deleteTerm', taxonomy, id, cb)
  }
}
