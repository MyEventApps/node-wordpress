function parseArguments(args) {
  return (
    [].slice
      .call(args, 1)

      // Remove null arguments
      // Null values only exist for optional fields. As of WordPress 4.4,
      // null is no longer treated the same as omitting the value. To
      // compensate for this, we just drop the argument before calling
      // into WordPress. See #25.
      .filter(function(value) {
        return value !== null
      })
  )
}

module.exports = {
  call: function(method) {
    const args = parseArguments(arguments)
    let cb = () => {} // no-op

    if (typeof args[args.length - 1] === 'function') {
      cb = args.pop()
    }

    this.rpc.methodCall(method, args, function(err, data) {
      if (!err) return cb(null, data)

      if (err.code === 'ENOTFOUND' && err.syscall === 'getaddrinfo') {
        err.message = 'Unable to connect to WordPress.'
      } else if (err.message === "Unknown XML-RPC tag 'TITLE'") {
        let additional = err.res.statusCode
        if (err.res.statusMessage) {
          additional += '; ' + err.res.statusMessage
        }

        err.message = '(' + additional + ') ' + err.message
      }

      cb(err)
    })
  },

  authenticatedCall: function(method) {
    const args = Array.from(arguments)
    args.splice(1, 0, this.blogId)
    if (method === 'wp.editPage') {
      args.splice(3, 0, this.username, this.password)
    } else if (method === 'wp.getPages') {
      args.splice(2, 0, this.username, this.password)
    } else {
      args.splice(2, 0, this.username, this.password)
    }
    this.call.apply(this, args)
  },

  listMethods: function(fn) {
    this.call('system.listMethods', fn)
  }
}
