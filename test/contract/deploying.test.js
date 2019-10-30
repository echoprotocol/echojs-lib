import BigNumber from 'bignumber.js';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../src/constants';
import { Echo } from '../../';
import { Contract } from '../../';
import { ok, strictEqual } from 'assert';
import { url, privateKey, accountId } from '../_test-data';
import { abi, bytecode as code } from '../operations/_contract.test';
/**
 * @param {string} id
 * @returns {boolean}
 */
function isContractId(id) {
	return new RegExp(`^1\\.${PROTOCOL_OBJECT_TYPE_ID.CONTRACT}\\.(0|[1-9]\\d*)$`).test(id);
}

describe('deploy', () => {
	let echo = new Echo();

	before(async function () {
		// eslint-disable-next-line no-invalid-this
		this.timeout(10e3);
		await echo.connect(url)
	});

	it('successful (without abi)', async () => {
		const res = await Contract.deploy(code, privateKey,  { echo, accountId });
		strictEqual(typeof res, 'string', 'invalid result type');
		ok(isContractId(res), 'invalid result format');
	}).timeout(10e3);

	it('successful (with abi)', async () => {
		/** @type {Contract} */
		const res = await Contract.deploy(code, privateKey, { echo, abi, accountId });
		ok(res instanceof Contract, 'expected result to be Contract class instance');
		ok(isContractId(res.address), 'invalid contract address format');
	}).timeout(10e3);

	it('successful (bytecode starts with "0x")', async () => {
		const res = await Contract.deploy(`0x${code}`, privateKey, { echo, accountId });
		ok(typeof res === 'string', 'invalid result type');
		ok(isContractId(res), 'invalid result format');
	}).timeout(10e3);

	it('value is BigNumber', async () => {
		await Contract.deploy(code, privateKey,  { echo, accountId, value: { amount: new BigNumber(0) } });
	}).timeout(10e3);
});
