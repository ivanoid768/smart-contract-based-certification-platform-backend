const jwt = require('jsonwebtoken');

module.exports = function (server, db) {

	server.post('/login/issuer', function respond(req, res, next) {
		let body = req.body;

		console.log(body)

		let issuers = db.collection("issuers");

		issuers.find({ 'login': body.login }).toArray(function (err, issuers) {
			let issuer = issuers[0];
			if (issuer.password != body.password) {
				res.send(404, 'invalid_password')
			}

			let token = jwt.sign({ payload: 'payload' }, issuer.password);

			console.log(issuer)

			db.collection('user_token').insert({
				user_id: issuer.id,
				token: token
			}, (err, result) => {
				console.log(result, err)
				res.send(201, token);
				next();
			})

		});
	});

	server.post('/registration/issuer', function (req, res, next) {
		let body = req.body;
		console.log(body)

		let issuers = db.collection("issuers");

		body.id = Math.floor(Math.random() * 90000) + 10000;

		issuers.insert(body, function (err, result) {

			console.log(result, err)
			res.send(201, 'Registration successfully complited!');
		});

	});

};