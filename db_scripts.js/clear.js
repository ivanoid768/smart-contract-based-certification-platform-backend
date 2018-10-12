const Db = require('tingodb')().Db;

const db = new Db('db', {});

let collectionsToDelete = [
	'default_certificates',
	'issuers'
]

collectionsToDelete.forEach(function (collection_name) {
	let cl = db.collection(collection_name).drop(function (err, delOk) {
		console.log(collection_name, err, delOk)
	})
})