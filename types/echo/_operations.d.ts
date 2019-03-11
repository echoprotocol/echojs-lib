import OPERATIONS from "../constants/operations-ids";
import PublicKey from "../../src/crypto/public-key";

type int64 = string | number;
type uint64 = string | number;
type bytes = Buffer | string;
type publicKey = PublicKey | string;

interface AssetAmount {
	asset_id: string;
	amount: int64;
}

interface MemoData {
	from: publicKey,
	to: publicKey,
	nonce: uint64,
	message: bytes,
}

type OPERATION_PROPS = {
	[OPERATIONS.TRANSFER]: {
		fee?: AssetAmount,
		from: string,
		to: string,
		amount: AssetAmount,
		memo?: MemoData,
		extensions?: void,
	},
	[OPERATIONS.LIMIT_ORDER_CREATE]: void,
	[OPERATIONS.LIMIT_ORDER_CANCEL]: void,
	[OPERATIONS.CALL_ORDER_UPDATE]: void,
	[OPERATIONS.FILL_ORDER]: void,
	[OPERATIONS.ACCOUNT_CREATE]: void,
	[OPERATIONS.ACCOUNT_UPDATE]: void,
	[OPERATIONS.ACCOUNT_WHITELIST]: void,
	[OPERATIONS.ACCOUNT_UPGRADE]: void,
	[OPERATIONS.ACCOUNT_TRANSFER]: void,
	[OPERATIONS.ASSET_CREATE]: void,
	[OPERATIONS.ASSET_UPDATE]: void,
	[OPERATIONS.ASSET_UPDATE_BITASSET]: void,
	[OPERATIONS.ASSET_UPDATE_FEED_PRODUCERS]: void,
	[OPERATIONS.ASSET_ISSUE]: {
		fee?: AssetAmount,
		issuer: string,
		asset_to_issue: AssetAmount,
		issue_to_account: string,
		extensions?: Set<void>,
	},
	[OPERATIONS.ASSET_RESERVE]: void,
	[OPERATIONS.ASSET_FUND_FEE_POOL]: void,
	[OPERATIONS.ASSET_SETTLE]: void,
	[OPERATIONS.ASSET_GLOBAL_SETTLE]: void,
	[OPERATIONS.ASSET_PUBLISH_FEED]: void,
	[OPERATIONS.WITNESS_CREATE]: void,
	[OPERATIONS.WITNESS_UPDATE]: void,
	[OPERATIONS.PROPOSAL_CREATE]: void,
	[OPERATIONS.PROPOSAL_UPDATE]: void,
	[OPERATIONS.PROPOSAL_DELETE]: void,
	[OPERATIONS.WITHDRAW_PERMISSION_CREATE]: void,
	[OPERATIONS.WITHDRAW_PERMISSION_UPDATE]: void,
	[OPERATIONS.WITHDRAW_PERMISSION_CLAIM]: void,
	[OPERATIONS.WITHDRAW_PERMISSION_DELETE]: void,
	[OPERATIONS.COMMITTEE_MEMBER_CREATE]: void,
	[OPERATIONS.COMMITTEE_MEMBER_UPDATE]: void,
	[OPERATIONS.COMMITTEE_MEMBER_UPDATE_GLOBAL_PARAMETERS]: void,
	[OPERATIONS.VESTING_BALANCE_CREATE]: void,
	[OPERATIONS.VESTING_BALANCE_WITHDRAW]: void,
	[OPERATIONS.WORKER_CREATE]: void,
	[OPERATIONS.CUSTOM]: void,
	[OPERATIONS.ASSERT]: void,
	[OPERATIONS.BALANCE_CLAIM]: void,
	[OPERATIONS.OVERRIDE_TRANSFER]: void,
	[OPERATIONS.TRANSFER_TO_BLIND]: void,
	[OPERATIONS.BLIND_TRANSFER]: void,
	[OPERATIONS.TRANSFER_FROM_BLIND]: void,
	[OPERATIONS.ASSET_SETTLE_CANCEL]: void,
	[OPERATIONS.ASSET_CLAIM_FEES]: void,
	[OPERATIONS.FBA_DISTRIBUTE]: void,
	[OPERATIONS.BID_COLLATERAL]: void,
	[OPERATIONS.EXECUTE_BID]: void,
	[OPERATIONS.CREATE_CONTRACT]: {
		fee?: AssetAmount,
		registrar: string,
		value: AssetAmount,
		code: string,
		eth_accuracy: boolean,
		supported_asset_id?: string,
	},
	[OPERATIONS.CALL_CONTRACT]: {
		fee?: AssetAmount,
		registrar: string,
		value: AssetAmount,
		code: string,
		callee: string,
	},
	[OPERATIONS.CONTRACT_TRANSFER]: void,
}

export default OPERATION_PROPS;
export { AssetAmount };
