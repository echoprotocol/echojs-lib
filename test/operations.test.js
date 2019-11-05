
describe('operations', () => {
	require('./operations/account-create.operation.test');
	require('./operations/asset-issue.test');
	require('./operations/create-asset.operation.test');
	require('./operations/transfer.operation.test');
	require('./operations/create-contract.operation.test');
	require('./operations/call-contract.operation.test');
	require('./operations/account-update.operations.test');
	require('./operations/disconnect-and-cache-renewing.operation.test');
	require('./operations/create-proposal.operation.test');
	require('./operations/update-asset-feed-producers.test');
	require('./operations/balance-freeze.operation.test');
	require('./operations/sidechain.btc.operations.test');
	require('./operations/non-default-fee-asset.test');
});
