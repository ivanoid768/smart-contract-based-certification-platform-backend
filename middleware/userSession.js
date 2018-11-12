module.exports = function (server, db) {

	server.use(function respond(req, res, next) {

		console.log('session', req.mySession)

		if (!req.mySession.userId)
			return next()
		else {
			db.collection('issuers').findOne({ _id: req.mySession.userId }, function (err, user) {
				if (user) {
					req.user = user;
					return next()
				} else {
					delete req.mySession.userId;
					return next()
				}
			})
		}

		// return next();

	});
}