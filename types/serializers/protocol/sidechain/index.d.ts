import * as _erc20 from './erc20';
import * as _eth from './eth';
import * as _btc from './btc';
import { asset, extensions } from '../../chain';
import { accountId, ethDepositId, ethWithdrawId } from '../../chain/id/protocol';
import { StructSerializer } from '../../collections';

export declare const sidechainIssueOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	value: typeof asset,
	account: typeof accountId,
	deposit_id: typeof ethDepositId,
	extensions: typeof extensions,
}>;

export declare const sidechainBurnOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	value: typeof asset,
	account: typeof accountId,
	withdraw_id: typeof ethWithdrawId,
	extensions: typeof extensions,
}>;

export declare const erc20: {
	registerToken: typeof _erc20.sidechainERC20RegisterTokenOperationPropsSerializer,
	depositToken: typeof _erc20.sidechainERC20DepositTokenOperationPropsSerializer,
	sendDepositToken: typeof _erc20.sidechainERC20SendDepositTokenOperationPropsSerializer,
	withdrawToken: typeof _erc20.sidechainERC20WithdrawTokenOperationPropsSerializer,
	sendWithdrawToken: typeof _erc20.sidechainERC20SendWithdrawTokenOperationPropsSerializer,
	approveTokenWithdraw: typeof _erc20.sidechainERC20ApproveTokenWithdrawOperationPropsSerializer,
	issue: typeof _erc20.sidechainERC20IssueOperationPropsSerializer,
	burn: typeof _erc20.sidechainERC20BurnOperationPropsSerializer,
};

export declare const eth: {
	createAddress: typeof _eth.sidechainEthCreateAddressOperationPropsSerializer,
	approveAddress: typeof _eth.sidechainEthApproveAddressOperationPropsSerializer,
	deposit: typeof _eth.sidechainEthDepositOperationPropsSerializer,
	sendDeposit: typeof _eth.sidechainEthSendDepositOperationPropsSerializer,
	withdraw: typeof _eth.sidechainEthWithdrawOperationPropsSerializer,
	sendWithdraw: typeof _eth.sidechainEthSendWithdrawOperationPropsSerializer,
	approveWithdraw: typeof _eth.sidechainEthApproveWithdrawOperationPropsSerializer,
	updateContractAddress: typeof _eth.sidechainEthUpdateContractAddressOperationPropsSerializer,
};

export declare const btc: {
	createAddress: typeof _btc.sidechainBtcCreateAddressOperationPropsSerializer,
	intermediateDeposit: typeof _btc.sidechainBtcIntermediateDepositOperationPropsSerializer,
	createIntermediateDeposit: typeof _btc.sidechainBtcCreateIntermediateDepositOperationPropsSerializer,
	deposit: typeof _btc.sidechainBtcDepositOperationPropsSerializer,
	withdraw: typeof _btc.sidechainBtcWithdrawOperationPropsSerializer
	aggregate: typeof _btc.sidechainBtcAggregateOperationPropsSerializer,
	approveAggregate: typeof _btc.sidechainBtcApproveAggregateOperationPropsSerializer,
};
