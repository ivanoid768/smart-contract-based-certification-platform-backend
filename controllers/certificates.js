module.exports = function (server, db) {

	server.get('/certificates', function respond(req, res, next) {

		//mongodb request for certificates!
		// console.log(req.query)
		// console.log('session', req.mySession)
		let collection = db.collection("default_certificates");

		collection.find({}).toArray(function (err, certificates) {
			// console.log(certificates)
			res.send(certificates);
			next();
		});


	});

	server.post('/certificates', function (req, res, next) {
		let body = req.body;
		// console.log(body)

		let collection = db.collection("default_certificates");

		collection.insert(body, function (err, result) {

			// console.log(result, err)
			res.send(201, result ? result.length : null);
		});

	});

};