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
	sidechainEthApproveAddressOperationPropsSerializer,
	sidechainEthDepositOperationPropsSerializer,
	sidechainEthWithdrawOperationPropsSerializer,
	sidechainEthApproveWithdrawOperationPropsSerializer,
	sidechainEthIssueOperationPropsSerializer,
	sidechainEthBurnOperationPropsSerializer,
} from './sidechain';

import {
	transferOperationPropsSerializer,
	overrideTransferOperationPropsSerializer,
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

export declare const account: {
	options: typeof accountOptionsSerializer,
	create: typeof accountCreateOperationPropsSerializer,
	update: typeof accountUpdateOperationPropsSerializer,
	whitelist: typeof accountWhitelistOperationPropsSerializer,
	transfer: typeof accountTransferOperationPropsSerializer,
	addressCreate: typeof accountAddressCreateOperationPropsSerializer,
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
	claimFees: typeof assetClaimFeesOperationPropsSerializer,
};

export { default as authority } from './authority';

export declare const balance: {
	claim: typeof balanceClaimOperationPropsSerializer,
};

export { default as chainParameters } from './chain_parameters';

export declare const committeeMember: {
	create: typeof committeeMemberCreateOperationPropsSerializer,
	update: typeof committeeMemberUpdateOperationPropsSerializer,
	updateGlobalParameters: typeof committeeMemberUpdateGlobalParametersOperationPropsSerializer,
};

export declare const contract: {
	base: typeof contractBaseOperationPropsSerializer,
	create: typeof contractCreateOperationPropsSerializer,
	call: typeof contractCallOperationPropsSerializer,
	transfer: typeof contractTransferOperationPropsSerializer,
	fundPool: typeof contractFundPoolOperationPropsSerializer,
	whitelist: typeof contractWhitelistOperationPropsSerializer,
};

export { default as ethAddress } from './ethAddress';
export { default as feeParameters } from './fee_parameters';
export { default as feeSchedule } from './fee_schedule';

export declare const proposal: {
	create: typeof proposalCreateOperationPropsSerializer,
	update: typeof proposalUpdateOperationPropsSerializer,
	delete: typeof proposalDeleteOperationPropsSerializer,
};

export declare const sidechain: {
	changeConfig: typeof sidechainChangeConfigOperationPropsSerializer,
	ethCreateAddress: typeof sidechainEthCreateAddressOperationPropsSerializer,
	ethApproveAddress: typeof sidechainEthApproveAddressOperationPropsSerializer,
	ethDeposit: typeof sidechainEthDepositOperationPropsSerializer,
	ethWithdraw: typeof sidechainEthWithdrawOperationPropsSerializer,
	ethApproveWithdraw: typeof sidechainEthApproveWithdrawOperationPropsSerializer,
	ethIssue: typeof sidechainEthIssueOperationPropsSerializer,
	ethBurn: typeof sidechainEthBurnOperationPropsSerializer,
};

export declare const transfer: {
	default: typeof transferOperationPropsSerializer,
	override: typeof overrideTransferOperationPropsSerializer,
	toAddress: typeof transferToAddressOperationPropsSerializer,
};

export declare const vesting: {
	balanceCreate: typeof vestingBalanceCreateOperationPropsSerializer,
	policyInitializer: typeof vestingPolicyInitializer,
	linearPolicyInitializer: typeof linearVestingPolicyInitializer,
	cddPolicyInitializer: typeof cddVestingPolicyInitializer,
	balanceWithdraw: typeof vestingBalanceWithdrawOperationPropsSerializer,
};

export declare const voteId: VoteIdSerializer;

export { VoteIdSerializer };
