import {
	accountOptionsSerializer,
	accountCreateOperationPropsSerializer,
	accountUpdateOperationPropsSerializer,
	accountWhitelistOperationPropsSerializer,
	accountTransferOperationPropsSerializer,
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
} from './contract';

import {
	proposalCreateOperationPropsSerializer,
	proposalUpdateOperationPropsSerializer,
	proposalDeleteOperationPropsSerializer,
} from './proposal';

import { sidechainChangeConfigOperationPropsSerializer } from './sidechain';

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
};

export {
	transferOperationPropsSerializer as transfer,
	overrideTransferOperationPropsSerializer as overrideTransfer,
} from './transfer';

export const vesting = {
	balanceCreate: vestingBalanceCreateOperationPropsSerializer,
	policyInitializer: vestingPolicyInitializer,
	linearPolicyInitializer: linearVestingPolicyInitializer,
	cddPolicyInitializer: cddVestingPolicyInitializer,
	balanceWithdraw: vestingBalanceWithdrawOperationPropsSerializer,
};

export const voteId = new VoteIdSerializer();

export { VoteIdSerializer };
