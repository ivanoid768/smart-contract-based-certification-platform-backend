const ObjectID = require('mongodb').ObjectID;

module.exports = function (server, db, collection_name, crudCBs) {

	if (!crudCBs) crudCBs = {};

	server.get(`/${collection_name}`, crudCBs.read || function (req, res, next) {

		let collection = db.collection(collection_name);

		collection.find({}).toArray(function (err, docs) {
			res.send(docs);
			next()
		});


	});

	server.get(`/${collection_name}/:id`, crudCBs.readById || function (req, res, next) {

		let collection = db.collection(collection_name);

		collection.find({ _id: new ObjectID(req.params.id) }).toArray(function (err, docs) {
			if (err) next(err)

			let doc;
			if (docs[0])
				doc = docs[0]
			res.send(doc);
		});


	});

	server.post(`/${collection_name}/:id`, crudCBs.update || function (req, res) {
		let body = req.body;

		let collection = db.collection(collection_name);

		collection.update({ _id: new ObjectID(req.params.id) }, { $set: body }, function (err, counter, status) {

			res.send(201, counter + ' ' + JSON.stringify(status));
		});

	});

	server.delete(`/${collection_name}/:id`, crudCBs.delete || function (req, res) {
		let collection = db.collection(collection_name);

		collection.deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {

			res.send(201, result ? result : null);
		});

	});

	server.post(`/${collection_name}`, crudCBs.create || function (req, res) {
		let body = req.body;

		let collection = db.collection(collection_name);

		collection.insert(body, function (err, result) {

			res.send(201, result ? result.length : null);
		});

	});

};