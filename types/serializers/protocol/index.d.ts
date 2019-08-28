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
} from './asset';

import {
	committeeMemberCreateOperationPropsSerializer,
	committeeMemberUpdateOperationPropsSerializer,
	committeeMemberUpdateGlobalParametersOperationPropsSerializer,
} from './committee_member';

import {
	proposalCreateOperationPropsSerializer,
	proposalUpdateOperationPropsSerializer,
	proposalDeleteOperationPropsSerializer,
} from './proposal';

import VoteIdSerializer from './VoteId';

import {
	vestingBalanceCreateOperationPropsSerializer,
	vestingPolicyInitializer,
	linearVestingPolicyInitializer,
	cddVestingPolicyInitializer,
	vestingBalanceWithdrawOperationPropsSerializer,
} from './vesting';

export declare const account: {
	options: typeof accountOptionsSerializer,
	create: typeof accountCreateOperationPropsSerializer,
	update: typeof accountUpdateOperationPropsSerializer,
	whitelist: typeof accountWhitelistOperationPropsSerializer,
	transfer: typeof accountTransferOperationPropsSerializer,
};

export { priceSerializer as price, priceFeedSerializer as priceFeed } from './asset';

export declare const asset: {
	options: typeof assetOptionsSerializer,
	bitassetOptions: typeof bitassetOptionsSerializer,
	create: typeof assetCreateOperationPropsSerializer,
	update: typeof assetUpdateOperationPropsSerializer,
	updateBitasset: typeof assetUpdateBitassetOperationPropsSerializer,
	updateFeedProducers: typeof assetUpdateFeedProducersOperationPropsSerializer,
	issue: typeof assetIssueOperationPropsSerializer,
	reserve: typeof assetReserveOperationPropsSerializer,
	fundFeePool: typeof assetFundFeePoolOperationPropsSerializer,
	publishFeed: typeof assetPublishFeedOperationPropsSerializer,
};

export { default as authority } from './authority';
export { default as chainParameters } from './chain_parameters';

export declare const committeeMember: {
	create: typeof committeeMemberCreateOperationPropsSerializer,
	update: typeof committeeMemberUpdateOperationPropsSerializer,
	updateGlobalParameters: typeof committeeMemberUpdateGlobalParametersOperationPropsSerializer,
};

export { default as ethAddress } from './ethAddress';
export { default as feeParameters } from './fee_parameters';
export { default as feeSchedule } from './fee_schedule';

export declare const proposal: {
	create: typeof proposalCreateOperationPropsSerializer,
	update: typeof proposalUpdateOperationPropsSerializer,
	delete: typeof proposalDeleteOperationPropsSerializer,
};

export { default as transfer } from './transfer';

export declare const vesting: {
	balanceCreate: typeof vestingBalanceCreateOperationPropsSerializer,
	policyInitializer: typeof vestingPolicyInitializer,
	linearPolicyInitializer: typeof linearVestingPolicyInitializer,
	cddPolicyInitializer: typeof cddVestingPolicyInitializer,
	balanceWithdraw: typeof vestingBalanceWithdrawOperationPropsSerializer,
};

export declare const voteId: VoteIdSerializer;

export { VoteIdSerializer };
