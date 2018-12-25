// const Db = require('tingodb')().Db;

// const db = new Db('db', {});

const MongoClient = require('mongodb').MongoClient;
const uuidv4 = require('uuid/v4')

const url = 'mongodb://localhost:27017/certification_platform';
const dbName = 'certification_platform';
const client = new MongoClient(url);

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia, doloremque explicabo nemo voluptate facilis assumenda recusandae? Temporibus nesciunt, porro voluptatem eaque a similique aliquid, ducimus commodi, exercitationem quasi vel deserunt unde mollitia amet illum rem id fugiat dicta saepe vitae magni repellendus quas veniam eligendi? Voluptatem eos repudiandae numquam neque. Voluptatum nulla reiciendis praesentium dolorem vitae voluptate tempora at fuga, esse, mollitia asperiores sequi voluptates modi rem rerum aspernatur commodi suscipit atque iure earum architecto totam natus laborum! Asperiores iure voluptates similique expedita, totam optio placeat fugiat eum. Atque tempore dignissimos voluptatem placeat dicta consequuntur soluta tempora distinctio laborum sint neque rerum vel, assumenda dolorem aliquam id totam aliquid sed blanditiis eligendi officiis in! Deserunt aut molestias, commodi ducimus, cupiditate rerum ullam consequatur, ipsa laborum laboriosam explicabo possimus nulla consectetur mollitia eos qui sequi illo cumque iste id quos natus expedita optio. Nobis illo nemo eligendi! Ducimus, adipisci! Vel, hic!';

client.connect().then(() => {

	const db = client.db(dbName);
	addMockIssuers(db)
		.then(addMockTemplates)
		.then(db => addMockDrafts(db, lorem))
		.then(db => addMockCertificates(db, lorem))
		.then(() => client.close())
		.catch(console.log)
})

function addMockIssuers(db) {
	console.log('addIssuers')
	let issuers = [];
	let pass = 'password'
	let names = generateNames();

	names.forEach(name => {
		let email;
		let login;

		if (name.name && name.company_name) {
			email = name.name + '.' + name.surname + '@' + name.company_name + '.com';
			login = name.name + '.' + name.surname;
		} else if (name.name && name.company_name == null) {
			email = name.name + '.' + name.surname + '@mail.com';
			login = name.name + '.' + name.surname;
		} else if (name.name == null && name.company_name) {
			email = 'mail@' + name.company_name + '.com';
			login = name.company_name;
		}

		issuers.push({
			login: login.toLowerCase(),
			email: email.toLowerCase(),
			eth_account: '0x' + generateRandomEthAccount(),
			password: pass,
			name: name.name,
			surname: name.surname,
			company_name: name.company_name
		})
	})

	issuers = removeDuplicates(issuers, (obj, o) => obj.email == o.email)
	issuers = issuers.slice(0, 4)

	return insertMockToCollection(db, 'issuers', issuers)
}

function generateRandomEthAccount() {
	let hexNumbers = 'abcdef';
	let str = '';
	for (let i = 0; i < 40; i++) {
		if (Math.random() > 0.5) {
			let rndDigit = Math.floor(Math.random() * 9) + 1;
			str += rndDigit;
		}
		else {
			let len = hexNumbers.length;
			let rndPos = Math.floor(Math.random() * len);
			if (rndPos == len)
				rndPos = len - 1;

			let rndChar = hexNumbers[rndPos]
			str += rndChar.toUpperCase();
		}

	}

	return str;
}

function generateNames() {

	const first_names = ['John', 'Ivan', 'Albert'];
	const surnames = ['Doe', 'Ivanov', 'Shtein']
	const company_names = ['SONY', 'Panasonyc', 'Valve']

	let names = []

	first_names.forEach(f_name => {
		surnames.forEach(s_name => {
			names.push({
				name: f_name,
				surname: s_name
			})
		})
	})

	let names_companies = []

	names.forEach(name => {
		company_names.forEach(c_name => {
			let rnd = Math.random();
			if (rnd <= 0.3) {
				names_companies.push({
					name: name.name,
					surname: name.surname,
					company_name: c_name
				})
			} else if (rnd > 0.3 && rnd <= 0.6) {
				names_companies.push({
					name: null,
					surname: null,
					company_name: c_name
				})
			} else if (rnd > 0.6) {
				names_companies.push({
					name: name.name,
					surname: name.surname,
					company_name: null
				})
			}

		})
	})
	return names_companies;
}

// INPUTS
const TEXT_INPUT = 'TEXT_INPUT';
const NUMBER_INPUT = 'NUMBER_INPUT';
const CHECKBOX_INPUT = 'CHECKBOX_INPUT';
const RADIOBUTTON_INPUT = 'RADIOBUTTON_INPUT';
const SWITCH_INPUT = 'SWITCH_INPUT';
const HEXNUMB_INPUT = 'HEXNUMB_INPUT';
const SELECT = 'SELECT';
const SLIDER = 'SLIDER';
const TEXTAREA = 'TEXTAREA';

function addMockTemplates(db) {
	console.log('addMockTemplates')
	let templates = []

	let standard_tmpl = {
		name: 'Standard Template 1',
		fields: [
			{
				type: TEXT_INPUT,
				caption: 'Name',
			},
			{
				type: TEXT_INPUT,
				caption: 'Issuer Name',
			},
			{
				type: TEXT_INPUT,
				caption: 'Issuer Surname',
			},
			{
				type: TEXT_INPUT,
				caption: 'Issuer Company Name',
			},
			{
				type: HEXNUMB_INPUT,
				caption: 'Issuer Eth Account'
			},
			{
				type: TEXT_INPUT,
				caption: 'Receiver Name',
			},
			{
				type: TEXT_INPUT,
				caption: 'Receiver Surname',
			},
			{
				type: TEXT_INPUT,
				caption: 'Receiver Company Name',
			},
			{
				type: HEXNUMB_INPUT,
				caption: 'Receiver Eth Account'
			},
			{
				type: TEXTAREA,
				caption: 'Description'
			}
		]
	}

	templates.push(standard_tmpl)

	return insertMockToCollection(db, 'templates', templates)
}

const certificateNames = ['Java EE', 'Java SE', 'ECMAScript 5', 'ECMAScript 7', 'CSS 3']

function addMockDrafts(db, lorem) {
	console.log('addMockDrafts')
	return new Promise(function (resolve, reject) {
		db.collection('issuers').find({}).toArray(function (err, issuers) {

			if (!err) {
				db.collection('templates').findOne({}, function (err, tmpl) {
					if (err)
						reject(err)
					else {
						let mockDrafts = generateMockDrafts(issuers, lorem, tmpl);
						resolve(insertMockToCollection(db, 'drafts', mockDrafts))
					}

				})
			} else {
				reject(err)
			}
		})
	})

	function generateMockDrafts(issuers, lorem, tmpl) {
		let drafts = [];
		for (let i = 0; i < 5; i++) {
			let name = getRndArrItem(certificateNames)
			drafts.push({
				template: tmpl._id,
				name: name,
				issuer: getRndArrItem(issuers)._id,
				description: name + ' ' + name + ' ' + lorem,
				timestamp: Date.now(),
			})

		}

		return drafts;
	}

}

const receiverNames = ['Vasya', 'Petya', 'Ivan', 'John', 'Alice', 'Nick', 'Maria'];
const receiverSurnames = ['Petrov', 'Smirnov', 'Ivanov', 'Doe', 'Stein', 'Malovich', 'Magdolen'];
const receiverCompNames = ['Sany', 'Morgan', 'Papasonyc', 'Minihard', 'Gazoil']

function addMockCertificates(db, lorem) {
	console.log('addMockCertificates')
	return new Promise(function (resolve, reject) {
		db.collection('drafts').find({}).toArray(function (err, drafts) {

			if (!err) {
				db.collection('templates').findOne({}, function (err, tmpl) {
					if (err)
						reject(err)
					else {
						let mockCertificates = generateMockCertificates(drafts, lorem, tmpl);
						resolve(insertMockToCollection(db, 'certificates', mockCertificates))
					}

				})
			} else {
				reject(err)
			}
		})
	})

	function generateMockCertificates(drafts, lorem, tmpl) {
		let certificates = [];

		for (let i = 0; i < 50; i++) {
			let draft = getRndArrItem(drafts)
			certificates.push({
				template: draft.template,
				name: draft.name,
				uuid: '0x' + uuidv4().replace(/-/g, ''),
				issuer: draft.issuer,
				description: draft.description,
				receiver: {
					name: getRndArrItem(receiverNames),
					surname: getRndArrItem(receiverSurnames),
					company_name: Math.random() > 0.5 ? getRndArrItem(receiverCompNames) : null,
					eth_account: '0x' + generateRandomEthAccount()
				},
				status: 'unissued',
				timestamp: Date.now(),
			})

		}

		return certificates;
	}

}

function addMockCertificates_Old(db, lorem) {

	let certificates = [];

	for (let i = 0; i < 30; i++) {
		certificates.push({
			certificate_guid: Math.floor(Math.random() * 90000) + 10000,
			name: 'Java EE',
			description: lorem,
			timestamp: Date.now(),
			issuer: Math.floor(Math.random() * 90000) + 10000,
			receiver: Math.floor(Math.random() * 90000) + 10000,
			status: 'incomplete',
		})

	}

	insertMockToCollection(db, 'certificates', certificates)

}

function insertMockToCollection(db, collection_name, mock_arr) {

	return new Promise(function (resolve, reject) {
		db.collection(collection_name)
			.insert(mock_arr, function (err, result) {
				console.log(collection_name, err)
				if (!err)
					resolve(db)
				else
					reject(err)
			})
	})

}

function removeDuplicates(arr, condition) {
	return arr.reduce((unique, o) => {
		if (!unique.some(obj => condition(obj, o))) {
			unique.push(o);
		}
		return unique;
	}, []);
}

function getRndArrItem(arr) {
	let len = arr.length;

	let rndPos = Math.floor(Math.random() * len);
	if (rndPos == len)
		rndPos = len - 1;

	return arr[rndPos]

}