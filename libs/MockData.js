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

module.exports = {
	generateRandomEthAccount: generateRandomEthAccount
}