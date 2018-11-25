const crud = require('../libs/CRUD')
const Web3Certification = require('../web3/certification')
const uuidv4 = require('uuid/v4')
const collection_name = 'certificates'

module.exports = function (server, db) {

	crud(server, db, collection_name, {
		create(req, res, next) {
			let body = req.body;

			let collection = db.collection(collection_name);

			if (!req.user) {
				next(new Error('no_user_error'))
			}

			if (body instanceof Array) {
				body.forEach(cft => {
					cft.issuer = req.user._id;
					let _uuid = '0x' + uuidv4().replace(/-/g, '')
					cft.uuid = _uuid;
				})

			} else {
				let _uuid = '0x' + uuidv4().replace(/-/g, '')
				body.uuid = _uuid;
				body.issuer = req.user._id;
			}

			collection.insert(body, function (err, result, status) {

				if (err) next(err);

				console.log('Inserted certificates: ', result, status)

				res.status(201).send({ ids: result.map(r => r._id) } || 'no_items_had_been_inserted');
			});
		},
		update(req, res, next) {
			let body = req.body;

			let collection = db.collection(collection_name);

			if (!req.user) {
				return next(new Error('no_user_error'))
			}
			if (!(body.status && body.status == 'issued')) {
				collection.update({ _id: req.params.id, issuer: req.user._id }, { $set: body }, function (err, counter, status) {
					res.status(201).send(counter + ' certificate_updated ' + JSON.stringify(status))

				})
			}
			else {
				body.status = 'issuing'

				let cft_id = req.params.id;
				let u_id = req.user._id;

				collection.update({ _id: req.params.id, issuer: req.user._id }, { $set: { status: body.status } }, function (err, counter, status) {

					collection.find({ _id: cft_id, issuer: u_id }).toArray(function (err, result) {
						Web3Certification.issueFromThePlatform(result[0], req.user, eth_status => console.log('eth_status: ', eth_status))
							.then(status => {
								if (status == 'issued') {
									collection.update({ _id: cft_id, issuer: u_id }, { $set: { status: 'issued' } }, function (err, count, stat) {
										console.log('Had been issued on Ethereum!', count, stat)
									})
								}
							})
					})

					res.status(201).send(counter + ' issuing_process_started ' + JSON.stringify(status));
				});

			}

		}
	})

}