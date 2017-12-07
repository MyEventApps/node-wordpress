const url = require('url')
const xmlrpc = require('xmlrpc')
const fieldMap = require('./fields')

// http://codex.wordpress.org/XML-RPC_Support
// http://codex.wordpress.org/XML-RPC_WordPress_API

const REQUIRED_CONFIG = ['url', 'username', 'password']

function Client(settings) {
  const missingProp = REQUIRED_CONFIG.find(p => !settings.hasOwnProperty(p))
  if (missingProp) throw new Error('Missing required setting: ' + missingProp)

  const parsedUrl = Client.parseUrl(settings.url)

  const clientCreator =
    xmlrpc[parsedUrl.secure ? 'createSecureClient' : 'createClient']

  this.rpc = clientCreator({
    host: settings.host || parsedUrl.host,
    port: parsedUrl.port,
    path: parsedUrl.path,
    rejectUnauthorized:
      settings.rejectUnauthorized !== undefined
        ? settings.rejectUnauthorized
        : true,

    // Always set Host header in case we're pointing to a different server
    // via settings.host
    headers: {
      Host: parsedUrl.host
    },
    basic_auth: !settings.basicAuth
      ? null
      : {
          user: settings.basicAuth.username,
          pass: settings.basicAuth.password
        }
  })
  this.blogId = settings.blogId || 0
  this.username = settings.username
  this.password = settings.password
}

Client.parseUrl = function(wpUrl) {
  var urlParts, secure

  // allow URLs without a protocol
  if (!/\w+:\/\//.test(wpUrl)) {
    wpUrl = 'http://' + wpUrl
  }
  urlParts = url.parse(wpUrl)
  secure = urlParts.protocol === 'https:'

  return {
    host: urlParts.hostname,
    port: urlParts.port || (secure ? 443 : 80),
    path: urlParts.path.replace(/\/+$/, '') + '/xmlrpc.php',
    secure: secure
  }
}

Object.assign(
  Client.prototype,
  require('./call'),
  require('./post'),
  require('./page'),
  require('./taxonomy'),
  require('./media')
)

module.exports = {
  createClient: settings => new Client(settings),
  Client,
  fieldMap
}
