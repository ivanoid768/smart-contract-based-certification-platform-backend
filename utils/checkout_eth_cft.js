const Web3 = require('web3');
const certificationConf = require('../configs/main_conf.json').web3.certification;
const platform_address = require('../configs/main_conf.json').web3.platform.address;

const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')
const eth = web3.eth;
const utils = web3.utils;
const contract_address = certificationConf.address;
const contact_abi = JSON.parse(certificationConf.abi);

const Contract = new eth.Contract(contact_abi, contract_address);
Contract.options.from = platform_address;

let uuid = '0xd1a6235a4f23470ea2e49a37b2bfecd8';

if (process.argv[2]) {
	uuid = process.argv[2]
}

const issueTx = Contract.methods.getCertificate(uuid);

issueTx.call()
	.then(result => {
		result[2] = utils.toUtf8(result[2])
		result[3] = utils.toUtf8(result[3])
		console.log(result);
	})
	.catch(console.log)
