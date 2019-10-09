import 'mocha';
import { strictEqual, ok, fail, deepStrictEqual } from 'assert';
import BigNumber from 'bignumber.js';
import $c from 'comprehension';
import { Echo, Contract } from '../../';
import checkContractIdTests from './_checkContractId.test';
import { abi, bytecode as code } from '../operations/_contract.test';
import { url, privateKey, accountId } from '../_test-data';

describe('Method', () => {

	/** @type {Contract} */
	let contract = null;
	const echo = new Echo();

	before(async function () {
		// eslint-disable-next-line no-invalid-this
		this.timeout(12e3);
		await echo.connect(url);
		contract = await Contract.deploy(code, privateKey, { echo, accountId, abi });
	});

	describe('call', () => {

		it('successful', async () => {
			/** @type {BigNumber} */
			const zero = await contract.methods.getVariable().call();
			ok(BigNumber.isBigNumber(zero), 'result is not a bigNumber');
			ok(zero.eq(0), 'result is not a zero');
		});

		describe('invalid contractId', () => {
			const testInvalidContractId = async ({ test, error, value }) => {
				try {
					await contract.methods.getVariable().call({ contractId: value || test });
				} catch (err) {
					ok(err instanceof Error);
					strictEqual(err.message, error);
					return;
				}
				fail('should throws');
			};
			for (const invalidContractIdTest of checkContractIdTests) {
				it(invalidContractIdTest.test, async () => testInvalidContractId(invalidContractIdTest));
			}
		});
	});

	describe('code getter', () => {
		it('get code method', () => {
			/** @type {Abi} */
			const abi = [{
				contract: false,
				inputs: [
					{ type: 'bytes24[3]', name: 'bytes72' },
					{ type: 'uint32[][2][]', name: 'multidimensional_array' },
					{ type: 'string', name: 'str' },
				],
				name: 'qwe',
				outputs: [{ type: 'bool', name: 'success' }],
				payable: false,
				stateMutability: 'nonpayable',
				type: 'function',
			}];
			const contract = new Contract(abi);
			const methodInstance = contract.methods.qwe(
				[
					Buffer.from($c(24, (i) => i)),
					{ value: 'dead', align: 'left' },
					{ value: 'qwe', encoding: 'ascii', align: 'right' },
				],
				[[[], [1]], [[2, 3], [4, 5, 6]], [[7, 8], [9]]],
				' \\(ꙨပꙨ)// ',
			);
			strictEqual(methodInstance.code, [
				'9c89d58f',
				'0000000000000000000102030405060708090a0b0c0d0e0f1011121314151617',
				'0000000000000000dead00000000000000000000000000000000000000000000',
				'0000000000000000000000000000000000000000000000000000000000717765',
				'00000000000000000000000000000000000000000000000000000000000000a0',
				'0000000000000000000000000000000000000000000000000000000000000180',
				'0000000000000000000000000000000000000000000000000000000000000003',
				'00000000000000000000000000000000000000000000000000000000000001c0',
				'00000000000000000000000000000000000000000000000000000000000001e0',
				'0000000000000000000000000000000000000000000000000000000000000220',
				'0000000000000000000000000000000000000000000000000000000000000280',
				'0000000000000000000000000000000000000000000000000000000000000300',
				'0000000000000000000000000000000000000000000000000000000000000360',
				'0000000000000000000000000000000000000000000000000000000000000010',
				'205c28ea99a8e18095ea99a8292f2f2000000000000000000000000000000000',
				'0000000000000000000000000000000000000000000000000000000000000000',
				'0000000000000000000000000000000000000000000000000000000000000001',
				'0000000000000000000000000000000000000000000000000000000000000001',
				'0000000000000000000000000000000000000000000000000000000000000002',
				'0000000000000000000000000000000000000000000000000000000000000002',
				'0000000000000000000000000000000000000000000000000000000000000003',
				'0000000000000000000000000000000000000000000000000000000000000003',
				'0000000000000000000000000000000000000000000000000000000000000004',
				'0000000000000000000000000000000000000000000000000000000000000005',
				'0000000000000000000000000000000000000000000000000000000000000006',
				'0000000000000000000000000000000000000000000000000000000000000002',
				'0000000000000000000000000000000000000000000000000000000000000007',
				'0000000000000000000000000000000000000000000000000000000000000008',
				'0000000000000000000000000000000000000000000000000000000000000001',
				'0000000000000000000000000000000000000000000000000000000000000009',
			].join(''));
		});
	});

	describe('broadcast', () => {
		it('successful', async () => {
			const res = await contract.methods.setVariable(123)
				.broadcast({ privateKey: privateKey, registrar: accountId });
			deepStrictEqual(new Set(Object.keys(res.contractResult)), new Set(['exec_res', 'tr_receipt']));
			ok(BigNumber.isBigNumber(res.decodedResult));
			ok(res.decodedResult.eq(123));
			deepStrictEqual(res.events, {});
			ok(Array.isArray(res.transactionResult));
			strictEqual(res.transactionResult.length, 1);
			deepStrictEqual(
				new Set(Object.keys(res.transactionResult[0])),
				new Set(['id', 'block_num', 'trx_num', 'trx']),
			);
			ok(await contract.methods.getVariable().call().then((/** @type {BigNumber} */res) => res.eq(123)));
		}).timeout(10e3);
	});
});
