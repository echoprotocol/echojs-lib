import { strictEqual, ok } from 'assert';

import { Echo, constants, serializers } from '../../';
import { privateKey, accountId, url } from '../_test-data';
import testExtensionsField from './_testExtensionsField';

import { ACCOUNT, ASSET} from '../../src/constants/object-types';
import { operation } from '../../src/serializers';

const { OPERATIONS_IDS } = constants;
const echo = new Echo();

describe('transfer', () => {
	before(() => echo.connect(url));

	after(() => echo.disconnect());

	describe('- transfer', () => {
		it('test', async () => {

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.TRANSFER, {
				from: accountId,
				to: `1.${ACCOUNT}.9`,
				amount: {
					asset_id: `1.${ASSET}.0`,
					amount: 1
				},
			});

			transaction.addSigner(privateKey);

			await transaction.broadcast();

		}).timeout(50000);
	});

	describe('successful validation', () => {
		it('full object', () => {
			operation.toRaw([OPERATIONS_IDS.TRANSFER, {
				fee: {
					asset_id: `1.${ASSET}.1`,
					amount: 20
				},
				from: `1.${ACCOUNT}.123`,
				to: `1.${ACCOUNT}.456`,
				amount: {
					asset_id: `1.${ASSET}.2`,
					amount: 30
				},
			}], true);
		});
	});

	describe('converting to Buffer', () => {
		it('minimal object', () => {
			const txProps = {
				// FIXME: remove optional fee
				fee: {
					asset_id: `1.${ASSET}.1`,
					amount: 20
				},
				from: `1.${ACCOUNT}.123`,
				to: `1.${ACCOUNT}.456`,
				amount: {
					asset_id: `1.${ASSET}.2`,
					amount: 30
				},
			};
			const result = serializers.protocol.transfer.default.serialize(txProps);
			ok(Buffer.isBuffer(result));
			strictEqual(result.toString('hex'), '1400000000000000017bc8031e000000000000000200');
		});
	});

	testExtensionsField(echo, OPERATIONS_IDS.TRANSFER, (extensions) => ({
		from: accountId,
		to: '1.2.9',
		amount: { asset_id: '1.3.0', amount: 1 },
		extensions,
	}));
});
