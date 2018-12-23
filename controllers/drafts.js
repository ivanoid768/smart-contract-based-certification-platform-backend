const crud = require('../libs/CRUD')
const collection_name = 'drafts'

module.exports = function (server, db) {

	crud(server, db, collection_name, {
		create(req, res, next) {
			let body = req.body;

			let collection = db.collection(collection_name);

			if (!req.user) {
				next(new Error('no_user_error'))
			}

			body.issuer = req.user._id;

			collection.insert(body, function (err, result) {

				if (err) next(err);

				res.send(201, result[0] || 'no_items_had_been_inserted');
			});
		}
	})

	server.get(`/my/${collection_name}`, function (req, res, next) {

		let userId = req.user._id;

		let coll = db.collection(collection_name);

		coll.find({ issuer: userId }).toArray()
			.then(cfts => {
				res.send(cfts)
			})
	})

}