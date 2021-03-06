module.exports = function (server, db) {

	server.post('/login', function (req, res) {
		let body = req.body;

		console.log('body: ', body)

		let issuers = db.collection("issuers");

		issuers.findOne({ 'login': body.login }, function (err, user) {
			if (err) {
				res.send(500, JSON.stringify(err))
			}
			else if (!user) {
				res.status(404).send('invalid_login')
			}
			else if (user.password != body.password) {
				res.send(404, 'invalid_password')
			}
			else {
				req.mySession.userId = user._id;
				res.status(201).send('login_success')
			}

		});
	});

	server.post('/registration/issuer', function (req, res) {
		let body = req.body;
		console.log(body)

		let issuers = db.collection("issuers");

		body._id = Math.floor(Math.random() * 90000) + 10000;

		issuers.insertOne(body, function (err, user) {
			if (err) {
				res.send(500, JSON.stringify(err))
			}
			else {
				console.log(user, err)
				res.send(201, 'Registration successfully complited!');
			}

		});

	});

	server.post('/logout', function (req, res) {
		if (req.mySession.userId) {

			let u_sock = server.get('user_socket')[req.mySession.userId]
			if (u_sock)
				u_sock.disconnect(true)

			delete req.mySession.userId;

		}
		res.send(200, 'logout_success')
	})

};