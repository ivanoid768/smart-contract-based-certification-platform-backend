function issuerWorkflowTest1() {

	const dUrl = 'http://localhost:8081/';

	logout()
		.then(login)
		.then(chooseTemplate)
		.then(createDraft)
		.then(createCertificates)
		.then(issueCertificates)
		.then(L.log)
		.catch(console.log)


	function logout() {
		return axios.post('http://localhost:8081/logout', null, { withCredentials: true })
			.then(console.log)

	}

	function login() {
		return axios.post('http://localhost:8081/login', { login: 'petya.vasyachkin', password: 'password' }, { withCredentials: true })
			.then(L.log)

	}

	function chooseTemplate() {
		return axios.get(dUrl + 'templates', { withCredentials: true })
			.then(L.log)
			.then(res => {
				return axios.get(dUrl + 'templates/' + res.data[0]._id, { withCredentials: true })
			})
			.then(res => res.data._id)
	}

	function createDraft(templateId) {

		let name = 'ECMAScript 7'

		let draft = {
			template: templateId,
			name: name,
			issuer: null,
			description: name + ' ' + name + ' ' + L.lorem,
			timestamp: Date.now(),
		}

		return axios.post(dUrl + 'drafts', draft, { withCredentials: true })
			.then(res => res.data)
	}

	function createCertificates(draft) {

		let certificates = [];

		for (let i = 0; i < 5; i++) {
			certificates.push({
				template: draft.template,
				name: draft.name,
				issuer: draft.issuer,
				description: draft.description,
				receiver: {
					name: L.receiverNames[i],
					surname: L.receiverSurnames[i],
					company_name: Math.random() > 0.5 ? L.receiverCompNames[i] : null,
					eth_account: '0x' + L.generateRandomEthAccount()
				},
				status: 'unissued',
				timestamp: Date.now(),
			})
		}

		return axios.post(dUrl + 'certificates', certificates, { withCredentials: true })
			.then(res => res.data.ids)

	}

	function issueCertificates(certificatesIds = []) {

		console.log('start--------')
		let promises = certificatesIds.map(cId => {
			console.log(cId)
			return axios.post(dUrl + 'certificates/' + cId, { status: 'test_backend_issued' }, { withCredentials: true })
		})
		console.log('end----------')
		return Promise.all(promises)

	}
}

const L = {
	lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia, doloremque explicabo nemo voluptate facilis assumenda recusandae? Temporibus nesciunt, porro voluptatem eaque a similique aliquid, ducimus commodi, exercitationem quasi vel deserunt unde mollitia amet illum rem id fugiat dicta saepe vitae magni repellendus quas veniam eligendi? Voluptatem eos repudiandae numquam neque. Voluptatum nulla reiciendis praesentium dolorem vitae voluptate tempora at fuga, esse, mollitia asperiores sequi voluptates modi rem rerum aspernatur commodi suscipit atque iure earum architecto totam natus laborum! Asperiores iure voluptates similique expedita, totam optio placeat fugiat eum. Atque tempore dignissimos voluptatem placeat dicta consequuntur soluta tempora distinctio laborum sint neque rerum vel, assumenda dolorem aliquam id totam aliquid sed blanditiis eligendi officiis in! Deserunt aut molestias, commodi ducimus, cupiditate rerum ullam consequatur, ipsa laborum laboriosam explicabo possimus nulla consectetur mollitia eos qui sequi illo cumque iste id quos natus expedita optio. Nobis illo nemo eligendi! Ducimus, adipisci! Vel, hic!',
	receiverNames: ['Vasya', 'Petya', 'Ivan', 'John', 'Alice', 'Nick', 'Maria'],
	receiverSurnames: ['Petrov', 'Smirnov', 'Ivanov', 'Doe', 'Stein', 'Malovich', 'Magdolen'],
	receiverCompNames: ['Sany', 'Morgan', 'Papasonyc', 'Minihard', 'Gazoil'],
	generateRandomEthAccount: function () {
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
	},
	log: function (res) {
		console.log(res)
		return res;
	},
	getCertificates: function () {
		axios.get('http://localhost:8081/certificates', { withCredentials: true })
			.then(console.log)
	},

	login: function () {
		axios.post('http://localhost:8081/login', { login: 'petya.vasyachkin', password: 'password' }, { withCredentials: true })
			.then(console.log)
	},

	logout: function () {
		axios.post('http://localhost:8081/logout', null, { withCredentials: true })
	}
}
