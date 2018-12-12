const Db = require('tingodb')().Db;
const Web3_Certification = require('../web3/certification')
const uuid = require('uuid/v5')
const generateRandomEthAccount = require('../libs/MockData').generateRandomEthAccount;

const db = new Db('db', {});
const issueFromThePlatform = Web3_Certification.issueFromThePlatform;

let _uuid = '0x' + uuid('certificate.' + Math.floor(Math.random() * 1000), '4fe9a687-714b-4838-b6dc-55a395ff7eb4')
	.replace(/-/g, '')
console.log(_uuid);

let issuer = {
	eth_account: '0x' + generateRandomEthAccount()
}

db.collection('certificates').find({ _id: 40 }).toArray(function (err, cfts) {

	let cft = cfts[0];

	cft.uuid = _uuid;

	issueFromThePlatform(cft, issuer, (msg, err) => console.log('callback: ', msg, err))
		.then(console.log)
		.catch(console.log)

})