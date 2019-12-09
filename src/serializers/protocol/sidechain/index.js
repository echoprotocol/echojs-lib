import * as _erc20 from './erc20';
import * as _eth from './eth';
import * as _btc from './btc';
import { struct } from '../../collections';
import { asset, extensions } from '../../chain';
import { accountId, ethDepositId, withdrawId } from '../../chain/id/protocol';

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
	withdraw_id: withdrawId,
	extensions,
});

export const erc20 = {
	registerToken: _erc20.sidechainERC20RegisterTokenOperationPropsSerializer,
	depositToken: _erc20.sidechainERC20DepositTokenOperationPropsSerializer,
	withdrawToken: _erc20.sidechainERC20WithdrawTokenOperationPropsSerializer,
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
	approveWithdraw: _eth.sidechainEthApproveWithdrawOperationPropsSerializer,
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
