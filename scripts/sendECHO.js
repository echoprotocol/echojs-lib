const { inspect } = require('util');
/** @type {import("../types/index")} */
const { default: echo, PrivateKey, OPERATIONS_IDS } = require('../dist/index');

const privateKey = PrivateKey.fromWif(process.argv[2]);
const toAccountId = process.argv[3];
const amount = process.argv[4];

(async () => {
	await echo.connect('wss://testnet.echo-dev.io/ws');
	const [[fromAccountId]] = await echo.api.getKeyReferences([privateKey.toPublicKey().toString()]);
	console.log('from', fromAccountId);
	const tx = echo.createTransaction().addOperation(OPERATIONS_IDS.TRANSFER, {
		amount: { asset_id: '1.3.0', amount },
		from: fromAccountId,
		to: toAccountId,
	}).addSigner(privateKey);
	console.log(inspect(await tx.broadcast(), false, null, true));
})().then(() => process.exit(0)).catch((err) => {
	console.error((err instanceof Error) || typeof err !== 'object' ? err : inspect(err, false, null, true));
	process.exit(1);
});
