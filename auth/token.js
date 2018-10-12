const jwt = require('jsonwebtoken');

module.exports = function (server, db) {
	server.use(function (req, res, next) {
		// console.warn('token!', req.path, req);
		let path = req.getPath();
		// console.log(path)
		if (path.indexOf('login') !== -1 || path.indexOf('registration') !== -1 || (path.indexOf('certificates') !== -1 && req.method != 'POST'))
			return next();

		let token = req.header('API-Token');

		console.log(token)

		if (!token)
			res.send(404, 'access_denied:token_did_not_provided')

		db.collection('user_token').find({ token: token }, function (err, users) {
			if (users.length < 1)
				res.send(404, 'access_denied:no_user_found_by_the_token')

			let user_id = users[0].user_id;
			db.collection('issuers').find({ id: user_id }, function (err, users) {
				req.user = users[0];
				return next();
			})
		})

	})
}