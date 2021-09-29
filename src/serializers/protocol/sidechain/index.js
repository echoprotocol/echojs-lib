import * as _erc20 from './erc20';
import * as _eth from './eth';
import * as _btc from './btc';
import { struct } from '../../collections';
import { asset, extensions } from '../../chain';
import { accountId, ethDepositId, ethWithdrawId } from '../../chain/id/protocol';

export const sidechainIssueOperationPropsSerializer = struct({
	fee: asset,
	value: asset,
	account: accountId,
	deposit_id: ethDepositId,
	extensions,
});

export const sidechainBurnOperationPropsSerializer = struct({
	fee: asset,
	value: asset,
	account: accountId,
	withdraw_id: ethWithdrawId,
	extensions,
});

// sidechain_spv_exchange_excess_funds_operation
export const sidechainSpvExchangeExcessFundsOperationPropsSerializer = struct({
	fee: asset,
	account: accountId,
	amount: asset,
	extensions,
});

export const erc20 = {
	registerContractOperation: _erc20.sidechainERC20RegisterContractOperationPropsSerializer,
	registerToken: _erc20.sidechainERC20RegisterTokenOperationPropsSerializer,
	depositToken: _erc20.sidechainERC20DepositTokenOperationPropsSerializer,
	sendDepositToken: _erc20.sidechainERC20SendDepositTokenOperationPropsSerializer,
	withdrawToken: _erc20.sidechainERC20WithdrawTokenOperationPropsSerializer,
	sendWithdrawToken: _erc20.sidechainERC20SendWithdrawTokenOperationPropsSerializer,
	approveTokenWithdraw: _erc20.sidechainERC20ApproveTokenWithdrawOperationPropsSerializer,
	issue: _erc20.sidechainERC20IssueOperationPropsSerializer,
	burn: _erc20.sidechainERC20BurnOperationPropsSerializer,
	transferAsset: _erc20.sidechainERC20TransferAssetOperationPropsSerializer,
};

export const eth = {
	spvCreate: _eth.sidechainEthSpvCreateOperationPropsSerializer,
	spvAddMissedTxReceipt: _eth.sidechainEthSpvAddMissedTxReceiptOperationPropsSerializer,
	createAddress: _eth.sidechainEthCreateAddressOperationPropsSerializer,
	approveAddress: _eth.sidechainEthApproveAddressOperationPropsSerializer,
	deposit: _eth.sidechainEthDepositOperationPropsSerializer,
	sendDeposit: _eth.sidechainEthSendDepositOperationPropsSerializer,
	withdraw: _eth.sidechainEthWithdrawOperationPropsSerializer,
	sendWithdraw: _eth.sidechainEthSendWithdrawOperationPropsSerializer,
	approveWithdraw: _eth.sidechainEthApproveWithdrawOperationPropsSerializer,
	updateContractAddress: _eth.sidechainEthUpdateContractAddressOperationPropsSerializer,
	stakeUpdate: _eth.sidechainStakeEthUpdateOperationPropsSerializer,
};

export const btc = {
	createAddress: _btc.sidechainBtcCreateAddressOperationPropsSerializer,
	deposit: _btc.sidechainBtcDepositOperationPropsSerializer,
	withdraw: _btc.sidechainBtcWithdrawOperationPropsSerializer,
	aggregate: _btc.sidechainBtcAggregateOperationPropsSerializer,
	approveAggregate: _btc.sidechainBtcApproveAggregateOperationPropsSerializer,
	spvCreate: _btc.sidechainBtcSpvCreateOperationPropsSerializer,
	spvAddMissedTxReceipt: _btc.sidechainBtcSpvAddMissedTxReceiptOperationPropsSerializer,
	createStakeScript: _btc.sidechainBtcCreateStakeScriptOperationPropsSerializer,
	stakeUpdate: _btc.sidechainStakeBtcUpdateOperationPropsSerializer,
};
