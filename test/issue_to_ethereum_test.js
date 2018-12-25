function IssueToEthereumTest(should_login = true) {
	let last5cftIds = [82, 83, 84, 85, 86];

	axios.defaults.withCredentials = true;
	axios.defaults.baseURL = 'http://localhost:8081'

	logInlogOut()
		.then(getLastCertificate)
		.then(setCftStatusToUnissued)
		.then(issueToEthereum)
		.catch(console.log)

	function logInlogOut() {
		if (should_login) {
			return logout()
				.then(login)
		} else {
			return Promise.resolve(true)
		}
	}

	function logout() {
		return axios.post('/logout', null)
			.then(console.log)

	}

	function login() {
		return axios.post('/login', { login: 'petya.vasyachkin', password: 'password' })
			.then(L.log)

	}

	function getLastCertificate() {
		return axios.get('/certificates/' + last5cftIds[4])
			.then(resp => resp.data)
			.then(L.log)
	}

	function setCftStatusToUnissued(cft) {
		return axios.post('/certificates/' + cft._id, { status: 'unissued' })
			.then(resp => {
				resp.cft_id = cft._id;
				return resp;
			})
			.then(L.log)
	}

	function issueToEthereum(resp) {
		return axios.post('/certificates/' + resp.cft_id, { status: 'issued' })
			.then(console.log)
	}

}