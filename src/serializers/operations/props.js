import { transfer as transferOpProps, account, asset, proposal, committeeMember } from '../protocol';

export const transfer = transferOpProps;
export const accountCreate = account.create;
export const accountUpdate = account.update;
export const accountWhitelist = account.whitelist;
export const accountTransfer = account.transfer;
export const assetCreate = asset.create;
export const assetUpdate = asset.update;
export const assetUpdateBitasset = asset.updateBitasset;
export const assetUpdateFeedProducers = asset.updateFeedProducers;
export const assetIssue = asset.issue;
export const assetReserve = asset.reserve;
export const assetFundFeePool = asset.fundFeePool;
export const assetPublishFeed = asset.publishFeed;
export const proposalCreate = proposal.create;
export const proposalUpdate = proposal.update;
export const proposalDelete = proposal.delete;
export const committeeMemberCreate = committeeMember.create;
export const committeeMemberUpdate = committeeMember.update;
export const committeeMemberUpdateGlobalParameters = committeeMember.updateGlobalParameters;
