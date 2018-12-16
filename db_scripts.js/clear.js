// const Db = require('tingodb')().Db;

// const db = new Db('db', {});

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/certification_platform';
// Database Name
const dbName = 'certification_platform';
const client = new MongoClient(url);

let collectionsToDelete = [
	'certificates',
	'issuers',
	'drafts',
	'templates'
]

client.connect().then(() => {

	const db = client.db(dbName);

	let counter = collectionsToDelete.length;

	collectionsToDelete.forEach(function (collection_name) {
		let cl = db.collection(collection_name).drop(function (err, delOk) {
			console.log(collection_name, err, delOk)

			counter--;

			if (!counter) client.close();
		})
	})

})