import * as _erc20 from './erc20';
import * as _eth from './eth';
import * as _btc from './btc';
import { asset, extensions } from '../../chain';
import { accountId } from '../../chain/id/protocol';
import { StructSerializer } from '../../collections';
import { config } from '../../plugins/sidechain';

export declare const sidechainChangeConfigOperationPropsSerializer: StructSerializer<{
	fee: typeof asset,
	registrar: typeof accountId,
	new_config: typeof config,
	extensions: typeof extensions,
}>;

export declare const erc20: {
	registerToken: typeof _erc20.sidechainERC20RegisterTokenOperationPropsSerializer,
	depositToken: typeof _erc20.sidechainERC20DepositTokenOperationPropsSerializer,
	withdrawToken: typeof _erc20.sidechainERC20WithdrawTokenOperationPropsSerializer,
	approveTokenWithdraw: typeof _erc20.sidechainERC20ApproveTokenWithdrawOperationPropsSerializer,
};

export declare const eth: {
	createAddress: typeof _eth.sidechainEthCreateAddressOperationPropsSerializer,
	approveAddress: typeof _eth.sidechainEthApproveAddressOperationPropsSerializer,
	deposit: typeof _eth.sidechainEthDepositOperationPropsSerializer,
	withdraw: typeof _eth.sidechainEthWithdrawOperationPropsSerializer,
	approveWithdraw: typeof _eth.sidechainEthApproveWithdrawOperationPropsSerializer,
	issue: typeof _eth.sidechainEthIssueOperationPropsSerializer,
	burn: typeof _eth.sidechainEthBurnOperationPropsSerializer,
};

export declare const btc: {
	createAddress: typeof _btc.sidechainBtcCreateAddressOperationPropsSerializer,
};
