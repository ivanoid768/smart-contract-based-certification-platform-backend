module.exports = function (db, req, next) {

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

}
