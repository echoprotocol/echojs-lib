import { ok } from 'assert';

import { Echo, constants } from '../../';
import { privateKey, accountId, url } from '../_test-data';

import { ASSET} from '../../src/constants/object-types';

const echo = new Echo();

describe('balance freeze operation', () => {

	before(() => echo.connect(url));

	after(() => echo.disconnect());

	describe('when the balance freeze operation is broadcast', () => {

		it('should not rejects and returns correct value', async () => {

			const duration = 90;
			const transaction = echo.createTransaction();			

			transaction.addOperation(constants.OPERATIONS_IDS.BALANCE_FREEZE, {				
				account: accountId,
				amount: {
					asset_id: `1.${ASSET}.0`,
					amount: 1000
				},
				duration,
			});

			transaction.addSigner(privateKey);

			const result = await transaction.broadcast();
			
			ok(result[0].trx.operations[0][0] === constants.OPERATIONS_IDS.BALANCE_FREEZE);
			ok(result[0].trx.operations[0][1].account === accountId);
			ok(result[0].trx.operations[0][1].duration === duration);

		}).timeout(50000);
	});
	
});
