const crud = require('../libs/CRUD')

const collectionNames = ['issuers', 'templates']

module.exports = function (server, db) {
	collectionNames.forEach(collection_name => crud(server, db, collection_name))
}