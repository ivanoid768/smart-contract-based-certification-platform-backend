const getUserViaSession = require('../auth/get_user_via_session')

module.exports = function (server, db) {

	server.use(function respond(req, res, next) {

		console.log('session', req.mySession)

		getUserViaSession(db, req, next)

		// return next();

	});
}