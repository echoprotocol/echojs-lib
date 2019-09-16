import BigNumber from 'bignumber.js';
import { OBJECT_TYPES } from '../../src/constants';
import Echo from '../../src/echo/index';
import PrivateKey from '../../src/crypto/private-key';

import { getContract } from './__testContract';
import Contract from '../../src/contract';
import { ok, strictEqual } from 'assert';

/** @type {{ wif: string, rpcAddress: string }} */
const config = require('config');

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
			async () => await echo.connect(config.rpcAddress),
		].map((func) => func()));
	});

	it('successful (without abi)', async () => {
		const res = await Contract.deploy(code, echo, PrivateKey.fromWif(config.wif));
		strictEqual(typeof res, 'string', 'invalid result type');
		ok(isContractId(res), 'invalid result format');
	}).timeout(8e3);

	it('successful (with abi)', async () => {
		/** @type {Contract} */
		const res = await Contract.deploy(code, echo, PrivateKey.fromWif(config.wif), { abi });
		ok(res instanceof Contract, 'expected result to be Contract class instance');
		ok(isContractId(res.address), 'invalid contract address format');
	}).timeout(7e3);

	it('value is BigNumber', async () => {
		await Contract.deploy(code, echo, PrivateKey.fromWif(config.wif), { value: { amount: new BigNumber(0) } });
	}).timeout(7e3);
});
