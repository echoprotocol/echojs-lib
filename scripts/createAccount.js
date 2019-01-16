const { ok } = require('assert');
const { inspect } = require('util');
const { default: echo, PrivateKey } = require('../dist');
const { CHAIN_APIS } = require('../dist/constants/ws-constants');

const [,, userName, privateKeySeed] = process.argv;

(async () => {
	await echo.connect('ws://195.201.164.54:6311', { apis: CHAIN_APIS });
	ok(userName && userName.length > 0, 'username not provided');
	ok(privateKeySeed && privateKeySeed.length > 0, 'private key seed not provided');
	const privateKey = PrivateKey.fromSeed(privateKeySeed);
	const publicKeyString = privateKey.toPublicKey().toString();
	await echo.api.registerAccount(
		userName,
		publicKeyString,
		publicKeyString,
		publicKeyString,
		'DET3vw54ewEd7G8aKGHSzC5QbKpGhWEaRH1EvscHMbwZNVW',
	);
})().then(() => process.exit(0)).catch((err) => {
	console.error((err instanceof Error) || typeof err !== 'object' ? err : inspect(err, false, null, true));
	process.exit(err.status || 1);
});
