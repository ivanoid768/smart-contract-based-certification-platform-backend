const Web3 = require('web3');
const { SHA3 } = require('sha3')
const certificationConf = require('../configs/main_conf.json').web3.certification;
const platform_address = require('../configs/main_conf.json').web3.platform.address;

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545') // TODO create one web3_connection on app start, and inject the connection to modules whitch requires it.
const eth = web3.eth;
const utils = web3.utils;
const hash = new SHA3(256)
const contract_address = certificationConf.address;
const contact_abi = JSON.parse(certificationConf.abi);

function issueFromThePlatform(cft, issuer, issuingStatusCb) {

	return new Promise(function (resolve, reject) {

		const Contract = new eth.Contract(contact_abi, contract_address);
		Contract.options.from = platform_address;

		let issuer_account = issuer.eth_account;
		issuer_account = issuer_account.indexOf('0x') == -1 ? '0x' + issuer_account : issuer_account;
		let descriptionHash = '0x' + hash.update(cft.description).digest('hex');
		hash.reset()
		let certificateHash = '0x' + hash.update(cft.name + cft.description + cft.receiver.name + cft.receiver.surname + cft.receiver.company_name)
			.digest('hex');
		hash.reset()

		const issueTx = Contract.methods.issue(
			cft.uuid,
			cft.name,
			utils.toHex(cft.receiver.name || ''),
			utils.toHex(cft.receiver.surname || ''),
			cft.receiver.company_name || '',
			issuer_account,
			cft.receiver.eth_account || '0x0', // TODO Replace '0x0' to more safe nullable account address!
			descriptionHash,
			certificateHash
		);

		issueTx.estimateGas()
			.then(gas => {
				issuingStatusCb('start');

				return issueTx.send({ gas: gas })
					.on('transactionHash', receipt => issuingStatusCb('transactionHash'))
					.on('receipt', receipt => issuingStatusCb('receipt'))
					.on('confirmation', (confN, receipt) => issuingStatusCb('confirmation_' + confN))
					.on('error', error => {
						issuingStatusCb(error.message, error)
						reject(error)
					})
			})
			.then(receipt => resolve('issued'))

	})
}

module.exports = {
	issueFromThePlatform: issueFromThePlatform
}