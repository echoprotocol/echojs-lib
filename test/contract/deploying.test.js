import BigNumber from 'bignumber.js';
import { OBJECT_TYPES } from '../../src/constants';
import { Echo } from '../../';
import { getContract } from './__testContract';
import { Contract } from '../../';
import { ok, strictEqual } from 'assert';
import { url, privateKey, accountId } from '../_test-data';
/**
 * @param {string} id
 * @returns {boolean}
 */
function isContractId(id) {
	return new RegExp(`^1\\.${OBJECT_TYPES.CONTRACT}\\.[1-9]\\d*$`).test(id);
}

describe('deploy', () => {

	/** @type {Buffer} */
	let code = null;

	/** @type {import("../types/_Abi").Abi} */
	let abi = null;

	let echo = new Echo();

	before(async function () {
		// eslint-disable-next-line no-invalid-this
		this.timeout(8e3);
		await Promise.all([
			async () => ({ code, abi } = await getContract()),
			async () => await echo.connect(url),
		].map((func) => func()));
	});

	it('successful (without abi)', async () => {
		const res = await Contract.deploy(code, privateKey, echo, { accountId });
		strictEqual(typeof res, 'string', 'invalid result type');
		ok(isContractId(res), 'invalid result format');
	}).timeout(8e3);

	it('successful (with abi)', async () => {
		/** @type {Contract} */
		const res = await Contract.deploy(code, privateKey, echo, { abi, accountId });
		ok(res instanceof Contract, 'expected result to be Contract class instance');
		ok(isContractId(res.address), 'invalid contract address format');
	}).timeout(7e3);

	it('value is BigNumber', async () => {
		await Contract.deploy(code, privateKey, echo, { accountId, value: { amount: new BigNumber(0) } });
	}).timeout(7e3);
});
