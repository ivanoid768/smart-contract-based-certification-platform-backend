module.exports = function (server, db) {

	server.use(function respond(req, res, next) {

		console.log('session', req.mySession)

		if (!req.mySession.userId)
			req.mySession.userId = true;

		return next();

	});
}