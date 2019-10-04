import * as _erc20 from './erc20';
import * as _eth from './eth';

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
