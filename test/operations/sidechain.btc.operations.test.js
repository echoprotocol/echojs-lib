import { Echo, constants } from '../../';
import { privateKey, accountId, url } from '../_test-data';

const { OPERATIONS_IDS } = constants;
const echo = new Echo();

describe('sidechain btc', () => {
	before(() => echo.connect(url));

	after(() => echo.disconnect());

	describe('create address', () => {
		it('test', async () => {

			const transaction = echo.createTransaction();

			transaction.addOperation(constants.OPERATIONS_IDS.SIDECHAIN_BTC_CREATE_ADDRESS, {
            	account: accountId,
            	backup_address: 'msrvud1myzB5gpFds8riorVR87kpr1Ga7k',
			});

			transaction.addSigner(privateKey);

            await transaction.broadcast();
		}).timeout(50000);
	});

});
