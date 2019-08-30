import {
	accountOptionsSerializer,
	accountCreateOperationPropsSerializer,
	accountUpdateOperationPropsSerializer,
	accountWhitelistOperationPropsSerializer,
	accountTransferOperationPropsSerializer,
	accountAddressCreateOperationPropsSerializer,
} from './account';

import {
	assetOptionsSerializer,
	bitassetOptionsSerializer,
	assetCreateOperationPropsSerializer,
	assetUpdateOperationPropsSerializer,
	assetUpdateBitassetOperationPropsSerializer,
	assetUpdateFeedProducersOperationPropsSerializer,
	assetIssueOperationPropsSerializer,
	assetReserveOperationPropsSerializer,
	assetFundFeePoolOperationPropsSerializer,
	assetPublishFeedOperationPropsSerializer,
	assetClaimFeesOperationPropsSerializer,
} from './asset';

import { balanceClaimOperationPropsSerializer } from './balance';

import {
	committeeMemberCreateOperationPropsSerializer,
	committeeMemberUpdateOperationPropsSerializer,
	committeeMemberUpdateGlobalParametersOperationPropsSerializer,
} from './committee_member';

import {
	contractBaseOperationPropsSerializer,
	contractCreateOperationPropsSerializer,
	contractCallOperationPropsSerializer,
	contractTransferOperationPropsSerializer,
	contractFundPoolOperationPropsSerializer,
	contractWhitelistOperationPropsSerializer,
} from './contract';

import {
	proposalCreateOperationPropsSerializer,
	proposalUpdateOperationPropsSerializer,
	proposalDeleteOperationPropsSerializer,
} from './proposal';

import {
	sidechainChangeConfigOperationPropsSerializer,
	sidechainEthCreateAddressOperationPropsSerializer,
	sidechainEthDepositOperationPropsSerializer,
	sidechainEthWithdrawOperationPropsSerializer,
	sidechainEthApproveWithdrawOperationPropsSerializer,
	sidechainEthIssueOperationPropsSerializer,
	sidechainEthBurnOperationPropsSerializer,
	sidechainERC20RegisterTokenOperationPropsSerializer,
	sidechainERC20DepositTokenOperationPropsSerializer,
} from './sidechain';

import {
	overrideTransferOperationPropsSerializer,
	transferOperationPropsSerializer,
	transferToAddressOperationPropsSerializer,
} from './transfer';

import {
	vestingBalanceCreateOperationPropsSerializer,
	vestingPolicyInitializer,
	linearVestingPolicyInitializer,
	cddVestingPolicyInitializer,
	vestingBalanceWithdrawOperationPropsSerializer,
} from './vesting';

import VoteIdSerializer from './VoteId';

export const account = {
	options: accountOptionsSerializer,
	create: accountCreateOperationPropsSerializer,
	update: accountUpdateOperationPropsSerializer,
	whitelist: accountWhitelistOperationPropsSerializer,
	transfer: accountTransferOperationPropsSerializer,
	addressCreate: accountAddressCreateOperationPropsSerializer,
};

export { priceSerializer as price, priceFeedSerializer as priceFeed } from './asset';

export const asset = {
	options: assetOptionsSerializer,
	bitassetOptions: bitassetOptionsSerializer,
	create: assetCreateOperationPropsSerializer,
	update: assetUpdateOperationPropsSerializer,
	updateBitasset: assetUpdateBitassetOperationPropsSerializer,
	updateFeedProducers: assetUpdateFeedProducersOperationPropsSerializer,
	issue: assetIssueOperationPropsSerializer,
	reserve: assetReserveOperationPropsSerializer,
	fundFeePool: assetFundFeePoolOperationPropsSerializer,
	publishFeed: assetPublishFeedOperationPropsSerializer,
	claimFees: assetClaimFeesOperationPropsSerializer,
};

export { default as authority } from './authority';

export const balance = {
	claim: balanceClaimOperationPropsSerializer,
};

export { default as chainParameters } from './chain_parameters';

export const committeeMember = {
	create: committeeMemberCreateOperationPropsSerializer,
	update: committeeMemberUpdateOperationPropsSerializer,
	updateGlobalParameters: committeeMemberUpdateGlobalParametersOperationPropsSerializer,
};

export const contract = {
	base: contractBaseOperationPropsSerializer,
	create: contractCreateOperationPropsSerializer,
	call: contractCallOperationPropsSerializer,
	transfer: contractTransferOperationPropsSerializer,
	fundPool: contractFundPoolOperationPropsSerializer,
	whitelist: contractWhitelistOperationPropsSerializer,
};

export { default as ethAddress } from './ethAddress';
export { default as feeParameters } from './fee_parameters';
export { default as feeSchedule } from './fee_schedule';

export const proposal = {
	create: proposalCreateOperationPropsSerializer,
	update: proposalUpdateOperationPropsSerializer,
	delete: proposalDeleteOperationPropsSerializer,
};

export const sidechain = {
	changeConfig: sidechainChangeConfigOperationPropsSerializer,
	ethCreateAddress: sidechainEthCreateAddressOperationPropsSerializer,
	ethApproveAddress: sidechainEthCreateAddressOperationPropsSerializer,
	ethDeposit: sidechainEthDepositOperationPropsSerializer,
	ethWithdraw: sidechainEthWithdrawOperationPropsSerializer,
	ethApproveWithdraw: sidechainEthApproveWithdrawOperationPropsSerializer,
	ethIssue: sidechainEthIssueOperationPropsSerializer,
	ethBurn: sidechainEthBurnOperationPropsSerializer,
	erc20RegisterToken: sidechainERC20RegisterTokenOperationPropsSerializer,
	erc20DepositToken: sidechainERC20DepositTokenOperationPropsSerializer,
};

export const transfer = {
	default: transferOperationPropsSerializer,
	override: overrideTransferOperationPropsSerializer,
	toAddress: transferToAddressOperationPropsSerializer,
};

export const vesting = {
	balanceCreate: vestingBalanceCreateOperationPropsSerializer,
	policyInitializer: vestingPolicyInitializer,
	linearPolicyInitializer: linearVestingPolicyInitializer,
	cddPolicyInitializer: cddVestingPolicyInitializer,
	balanceWithdraw: vestingBalanceWithdrawOperationPropsSerializer,
};

export const voteId = new VoteIdSerializer();

export { VoteIdSerializer };
