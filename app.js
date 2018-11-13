const Db = require('tingodb')().Db;
const restify = require('restify');
const sessions = require("client-sessions")
const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
	preflightMaxAge: 5, //Optional
	origins: ['null'],
	allowHeaders: ['API-Token'],
	exposeHeaders: ['API-Token-Expiry'],
	credentials: true
})

const db = new Db(__dirname + '/db', {});
const server = restify.createServer();

server.pre(cors.preflight)

server.use(sessions({
	cookieName: 'mySession', // cookie name dictates the key name added to the request object
	secret: 'blargadeeblargblarg', // should be a large unguessable string
	duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
	activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
	cookie: {
		// path: '/api', // cookie will only be sent to requests under '/api'
		// maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
		// ephemeral: false, // when true, cookie expires when the browser closes
		httpOnly: false, // when true, cookie is not accessible from javascript
		secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
	}
}))
server.use(cors.actual)
server.use(restify.plugins.queryParser({ mapParams: false }));
server.use(restify.plugins.bodyParser())
// require('./auth/token')(server, db);
require('./middleware/userSession')(server, db)
require('./middleware/accessByRole')(server, db)

// require('./controllers/certificates')(server, db);
require('./controllers')(server, db)

server.listen(8081, function () {
	console.log('%s listening at %s', server.name, server.url);
});