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

export const erc20 = {
	registerToken: _erc20.sidechainERC20RegisterTokenOperationPropsSerializer,
	depositToken: _erc20.sidechainERC20DepositTokenOperationPropsSerializer,
	sendDepositToken: _erc20.sidechainERC20SendDepositTokenOperationPropsSerializer,
	withdrawToken: _erc20.sidechainERC20WithdrawTokenOperationPropsSerializer,
	sendWithdrawToken: _erc20.sidechainERC20SendWithdrawTokenOperationPropsSerializer,
	approveTokenWithdraw: _erc20.sidechainERC20ApproveTokenWithdrawOperationPropsSerializer,
	issue: _erc20.sidechainERC20IssueOperationPropsSerializer,
	burn: _erc20.sidechainERC20BurnOperationPropsSerializer,
};

export const eth = {
	createAddress: _eth.sidechainEthCreateAddressOperationPropsSerializer,
	approveAddress: _eth.sidechainEthApproveAddressOperationPropsSerializer,
	deposit: _eth.sidechainEthDepositOperationPropsSerializer,
	sendDeposit: _eth.sidechainEthSendDepositOperationPropsSerializer,
	withdraw: _eth.sidechainEthWithdrawOperationPropsSerializer,
	sendWithdraw: _eth.sidechainEthSendWithdrawOperationPropsSerializer,
	approveWithdraw: _eth.sidechainEthApproveWithdrawOperationPropsSerializer,
	updateContractAddress: _eth.sidechainEthUpdateContractAddressOperationPropsSerializer,
};

export const btc = {
	createAddress: _btc.sidechainBtcCreateAddressOperationPropsSerializer,
	intermediateDeposit: _btc.sidechainBtcIntermediateDepositOperationPropsSerializer,
	createIntermediateDeposit: _btc.sidechainBtcCreateIntermediateDepositOperationPropsSerializer,
	deposit: _btc.sidechainBtcDepositOperationPropsSerializer,
	withdraw: _btc.sidechainBtcWithdrawOperationPropsSerializer,
	aggregate: _btc.sidechainBtcAggregateOperationPropsSerializer,
	approveAggregate: _btc.sidechainBtcApproveAggregateOperationPropsSerializer,
};
