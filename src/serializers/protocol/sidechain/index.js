import * as _erc20 from './erc20';
import * as _eth from './eth';
import * as _btc from './btc';
import { struct } from '../../collections';
import { asset, extensions } from '../../chain';
import { accountId } from '../../chain/id/protocol';
import { config } from '../../plugins/echorand';

export const sidechainChangeConfigOperationPropsSerializer = struct({
	fee: asset,
	registrar: accountId,
	new_config: config,
	extensions,
});

export const erc20 = {
	registerToken: _erc20.sidechainERC20RegisterTokenOperationPropsSerializer,
	depositToken: _erc20.sidechainERC20DepositTokenOperationPropsSerializer,
	withdrawToken: _erc20.sidechainERC20WithdrawTokenOperationPropsSerializer,
	approveTokenWithdraw: _erc20.sidechainERC20ApproveTokenWithdrawOperationPropsSerializer,
};

export const eth = {
	createAddress: _eth.sidechainEthCreateAddressOperationPropsSerializer,
	approveAddress: _eth.sidechainEthApproveAddressOperationPropsSerializer,
	deposit: _eth.sidechainEthDepositOperationPropsSerializer,
	withdraw: _eth.sidechainEthWithdrawOperationPropsSerializer,
	approveWithdraw: _eth.sidechainEthApproveWithdrawOperationPropsSerializer,
	issue: _eth.sidechainEthIssueOperationPropsSerializer,
	burn: _eth.sidechainEthBurnOperationPropsSerializer,
};

export const btc = {
	createAddress: _btc.sidechainBtcCreateAddressOperationPropsSerializer,
	intermediateDeposit: _btc.sidechainBtcIntermediateDepositOperationPropsSerializer,
	deposit: _btc.sidechainBtcDepositOperationPropsSerializer,
	withdraw: _btc.sidechainBtcWithdrawOperationPropsSerializer,
	aggregate: _btc.sidechainBtcAggregateOperationPropsSerializer,
};
