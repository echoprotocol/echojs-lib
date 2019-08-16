import echo, { constants } from '../../src';
import { url, privateKey, accountId } from './../_test-data';
import { bytecode } from '../operations/_contract.test';
import { strictEqual } from 'assert';

const prepare = async () => {
	await echo.connect(url, {
		connectionTimeout: 5000,
		maxRetries: 5,
		pingTimeout: 3000,
		pingDelay: 10000,
		debug: false,
		apis: constants.WS_CONSTANTS.CHAIN_APIS,
	});
	const balanceObject = await echo.api.getObject(`1.${constants.OBJECT_TYPES.BALANCE}.0`);

	if (!balanceObject)
		return;

	const tx = echo.createTransaction();

	const options = {
		deposit_to_account: accountId,
		balance_to_claim: `1.${constants.OBJECT_TYPES.BALANCE}.0`,
		balance_owner_key: privateKey.toPublicKey().toString(),
		total_claimed: balanceObject.balance,
	};

	tx.addOperation(constants.OPERATIONS_IDS.BALANCE_CLAIM, options);

	tx.addSigner(privateKey);

	await tx.broadcast(() => console.log('claim tx was broadcasted'));

	const contractTx = echo.createTransaction();
	contractTx.addOperation(constants.OPERATIONS_IDS.CONTRACT_CREATE, {
		code: bytecode + '0123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210',
		eth_accuracy: false,
		registrar: accountId,
		value: { asset_id: `1.${constants.OBJECT_TYPES.ASSET}.0`, amount: 0 },
	});

	contractTx.addSigner(privateKey);

	const broadcastingResult = await contractTx.broadcast(() => console.log('create contract tx was broadcasted'));
	const operationResult = await echo.api.getContractResult(broadcastingResult[0].trx.operation_results[0][1]);
	strictEqual(operationResult[1].exec_res.excepted, 'None', 'contract deployment failed');
};

prepare()
	.then(() => echo.disconnect())
	.catch((e) => {
		console.log(e);
		console.log(e.data.stack)
		throw e;
	});
