function SocketIOtest() {
	logout()
		.then(login)
		.then(setSocketListener)
		.then(() => IssueToEthereumTest(false))

	function setSocketListener() {
		const skt = io('http://localhost:8081');
		window.the_socket = skt;
		console.log(skt);

		skt.on('eth_status', msg => console.log('Sock.msg: ', msg))

		return true;
	}

}