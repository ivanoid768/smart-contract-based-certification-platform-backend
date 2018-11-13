const crud = require('../libs/CRUD')
const collection_name = 'certificates'

module.exports = function (server, db) {

	crud(server, db, collection_name, {
		create(req, res, next) {
			let body = req.body;

			let collection = db.collection(collection_name);

			if (!req.user) {
				next(new Error('no_user_error'))
			}

			body.issuer = req.user._id;

			collection.insert(body, function (err, result, status) {

				if (err) next(err);

				console.log('Inserted certificates: ', result, status)

				res.send(201, { ids: result.map(r => r._id) } || 'no_items_had_been_inserted');
			});
		},
		update(req, res, next) {
			let body = req.body;

			let collection = db.collection(collection_name);

			if (!req.user) {
				next(new Error('no_user_error'))
			}

			collection.update({ _id: req.params.id, issuer: req.user._id }, { $set: body }, function (err, counter, status) {

				res.send(201, counter + ' ' + JSON.stringify(status));
			});
		}
	})

}