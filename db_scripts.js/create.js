const Db = require('tingodb')().Db;

const db = new Db('../db', {});

db.collection("issuers").drop(function (err, delOk) {
	console.log(err, delOk)

	db.createCollection("issuers",
		{
			'validator': {
				'$and':
					[
						// { 'login': { '$type': "string" } },
						{ 'email': { '$regex': /@[A-Za-z0-9_]\.[A-Za-z]$/ } },
						{ 'password': { '$type': "string" } },
						{ 'name': { '$type': "string" } },
						{ 'surname': { '$type': "string" } },
						// { 'company': { '$type': "string" } },
						{ 'eth_account': { '$type': "string" } }
					]
			}
		},
		function (err, results) {
			console.log(err, results._name);
		}
	);

})

db.collection("receivers").drop(function (err, delOk) {
	console.log(err, delOk)

	db.createCollection("receivers",
		{
			'validator': {
				'$and':
					[
						// { 'login': { '$type': "string" } },
						{ 'email': { '$regex': /@[A-Za-z0-9_]\.[A-Za-z]$/ } },
						{ 'password': { '$type': "string" } },
						{ 'name': { '$type': "string" } },
						{ 'surname': { '$type': "string" } },
						// { 'company': { '$type': "string" } },
						// { 'eth_account': { '$type': "string" } }
					]
			}
		},
		function (err, results) {
			console.log(err, results._name);
		}
	);

})

db.collection("default_user").drop(function (err, delOk) {
	console.log(err, delOk)

	db.createCollection("default_user",
		{
			'validator': {
				'$and':
					[
						{ 'login': { '$type': "string" } },
						// { 'email': { '$regex': /@[A-Za-z0-9_]\.[A-Za-z]$/ } },
						{ 'password': { '$type': "string" } },
						{ 'nickname': { '$type': "string" } },
						// { 'eth_account': { '$type': "string" } }
					]
			}
		},
		function (err, results) {
			console.log(err, results._name);
		}
	);

})

db.collection("default_certificates").drop(function (err, delOk) {
	console.log(err, delOk)

	db.createCollection("default_certificates",
		{
			'validator': {
				'$and':
					[
						{ 'certificate_guid': { '$type': "int" } },
						{ 'name': { '$type': "string" } },
						{ 'description': { '$type': "string" } },
						{ 'timestamp': { '$type': "timestamp" } },
						{ 'issuer': { '$type': "int" } },
						{ 'receiver': { '$type': "int" } },
						{ 'status': { '$in': ["incomplete", "processing", "issued"] } },
					]
			}
		},
		function (err, results) {
			console.log(err, results._name);
		}
	);

})

db.collection("drafts").drop(function (err, delOk) {
	console.log(err, delOk)

	db.createCollection("drafts",
		{
			'validator': {
				'$and':
					[
						{ 'certificate_guid': { '$type': "int" } },
						{ 'name': { '$type': "string" } },
						{ 'description': { '$type': "string" } },
						{ 'issuer': { '$type': "int" } },
						{ 'receiver': { '$type': "int" } },
					]
			}
		},
		function (err, results) {
			console.log(err, results._name);
		}
	);

})


db.collection("certificate_templates").drop(function (err, delOk) {
	console.log(err, delOk)

	db.createCollection("certificate_templates",
		{
			'validator': {
				'$and':
					[
						{ 'name': { '$type': "string" } },
						{ 'fields': { '$type': "object" } }
					]
			}
		},
		function (err, results) {
			console.log(err, results._name);
		}
	);

})

db.collection("user_token").drop(function (err, delOk) {
	console.log(err, delOk)

	db.createCollection("user_token",
		{
			'validator': {
				'$and':
					[
						{ 'user_id': { '$type': "string" } },
						{ 'token': { '$type': "string" } }
					]
			}
		},
		function (err, results) {
			console.log(err, results._name);
		}
	);

})