import BigNumber from 'bignumber.js';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../src/constants';
import { Echo } from '../../';
import { Contract } from '../../';
import { ok, strictEqual } from 'assert';
import { url, privateKey, accountId } from '../_test-data';
import { abi, bytecode as code } from '../operations/_contract.test';


import { inspect } from "util";

/**
 * @param {string} id
 * @returns {boolean}
 */
function isContractId(id) {
	return new RegExp(`^1\\.${PROTOCOL_OBJECT_TYPE_ID.CONTRACT}\\.[1-9]\\d*$`).test(id);
}

describe('deploy', () => {
	let echo = new Echo();

	before(async function () {
		// eslint-disable-next-line no-invalid-this
		this.timeout(10e3);
		await echo.connect(url)
	});

	it('successful', async () => {
		try {
			const res = await new Contract(abi, { registrar: accountId, echo }).deploy(code).send(privateKey);
			console.log(inspect(res, false, null, true));
			// /** @type {Contract} */
			// const res = await Contract.deploy(code, privateKey, { echo, abi, accountId });
			ok(res instanceof Contract, 'expected result to be Contract class instance');
			ok(isContractId(res.address), 'invalid contract address format');
		} catch (err) {
			console.error(inspect(err, false, null, true));
			throw err;
		}
	}).timeout(10e3);

	it('value is BigNumber', async () => {
		await Contract.deploy(code, privateKey,  { echo, accountId, value: { amount: new BigNumber(0) } });
	}).timeout(10e3);
});
