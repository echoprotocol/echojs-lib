import * as _erc20 from './erc20';
import * as _eth from './eth';

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
