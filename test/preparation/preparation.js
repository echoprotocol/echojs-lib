import echo, { constants, OPERATIONS_IDS } from '../../';
import { url, privateKey, accountId } from './../_test-data';

const prepare = async () => {
	await echo.connect(url, {
		connectionTimeout: 5000,
		maxRetries: 5,
		pingTimeout: 3000,
		pingDelay: 10000,
		debug: false,
		apis: constants.WS_CONSTANTS.CHAIN_APIS,
	});
	const balanceObject = await echo.api.getObject(`1.${constants.PROTOCOL_OBJECT_TYPE_ID.BALANCE}.0`);
	if (!balanceObject) return;
	/** @type {import("../../types/echo/transaction").default} */
	const tx = echo.createTransaction();
	tx.addOperation(OPERATIONS_IDS.BALANCE_CLAIM, {
		deposit_to_account: accountId,
		balance_to_claim: `1.${constants.PROTOCOL_OBJECT_TYPE_ID.BALANCE}.0`,
		balance_owner_key: privateKey.toPublicKey().toString(),
		total_claimed: balanceObject.balance,
	}).addSigner(privateKey)
	console.log('broadcasting claim tx...');
	await tx.broadcast();
	console.log('claim tx was broadcasted');
};

prepare()
	.then(() => echo.disconnect())
	.catch((e) => {
		console.log(e);
		console.log(e.data.stack)
		throw e;
	});
