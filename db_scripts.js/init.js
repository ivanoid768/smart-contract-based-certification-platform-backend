const Db = require('tingodb')().Db;

const db = new Db('../db', {});

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia, doloremque explicabo nemo voluptate facilis assumenda recusandae? Temporibus nesciunt, porro voluptatem eaque a similique aliquid, ducimus commodi, exercitationem quasi vel deserunt unde mollitia amet illum rem id fugiat dicta saepe vitae magni repellendus quas veniam eligendi? Voluptatem eos repudiandae numquam neque. Voluptatum nulla reiciendis praesentium dolorem vitae voluptate tempora at fuga, esse, mollitia asperiores sequi voluptates modi rem rerum aspernatur commodi suscipit atque iure earum architecto totam natus laborum! Asperiores iure voluptates similique expedita, totam optio placeat fugiat eum. Atque tempore dignissimos voluptatem placeat dicta consequuntur soluta tempora distinctio laborum sint neque rerum vel, assumenda dolorem aliquam id totam aliquid sed blanditiis eligendi officiis in! Deserunt aut molestias, commodi ducimus, cupiditate rerum ullam consequatur, ipsa laborum laboriosam explicabo possimus nulla consectetur mollitia eos qui sequi illo cumque iste id quos natus expedita optio. Nobis illo nemo eligendi! Ducimus, adipisci! Vel, hic!';

// addMockCertificates(db, lorem)

generateRandomEthAccount()

function addMockIssuers(db) {
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
			eth_account: generateRandomEthAccount(),
			password: pass,
			name: name.name,
			surname: name.surname,
			company_name: name.company_name
		})
	})

	insertMockToCollection(db, 'issuers', issuers)
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

	// console.log('0x' + str)
	return str;
}

function generateNames() {

	const first_names = ['John', 'Ivan', 'Albert'];
	const surnames = ['Doe', 'Ivanov', 'Shtein']
	const company_names = ['SONY Ltd.', 'Panasonyc', 'Valve']

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
					name: name.f_name,
					surname: name.s_name,
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
					name: name.f_name,
					surname: name.s_name,
					company_name: null
				})
			}

		})
	})

	return names_companies;
}

function addMockCertificates(db, lorem) {

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
	db.collection(collection_name)
		.insert(mock_arr, function (err, result) {
			console.log(collection_name, result.lenght, err)

		})
}