import BigNumber from "bignumber.js";

export declare function validateUrl(value?: any): boolean;
export declare function isString(value?: any): boolean;
export declare function isEmpty(value?: any): boolean;
export declare function isVoid(value?: any): boolean;
export declare function isEmpty(value?: any): boolean;
export declare function isUndefined(value?: any): boolean;
export declare function isArray(value?: any): boolean;
export declare function isEmpty(value?: any): boolean;
export declare function isEmptyArray(value?: any): boolean;
export declare function isNumber(value?: any): boolean;
export declare function isUInt64(value?: any): boolean;
export declare function isUInt32(value?: any): boolean;
export declare function isUInt16(value?: any): boolean;
export declare function isUInt8(value?: any): boolean;
export declare function isInt64(value?: any): boolean;
export declare function isFunction(value?: any): boolean;
export declare function isBoolean(value?: any): boolean;
export declare function isObject(value?: any): boolean;
export declare function isEmptyObject(value?: any): boolean;

export declare function isAccountId(value?: any): boolean;
export declare function isAccountAddressId(value?: any): boolean;
export declare function isEthAddressId(value?: any): boolean;
export declare function isAssetId(value?: any): boolean;
export declare function isCommitteeMemberId(value?: any): boolean;
export declare function isProposalId(value?: any): boolean;
export declare function isOperationHistoryId(value?: any): boolean;
export declare function isVestingBalanceId(value?: any): boolean;
export declare function isBalanceId(value?: any): boolean;
export declare function isContractId(value?: any): boolean;
export declare function isContractResultId(value?: any): boolean;
export declare function isAccountBalanceId(value?: any): boolean;
export declare function isOperationId(value?: any): boolean;
export declare function isVoteId(value?: any): boolean;
export declare function isERC20TokenId(value?: string): boolean;
export declare function isObjectId(value?: any): boolean;

export declare function isBuffer(value?: any): boolean;
export declare function isHex(value?: any): boolean;
export declare function isBytes(value?: any): boolean;
export declare function isBytecode(value?: any): boolean;
export declare function isRipemd160(value?: any): boolean;

export declare function isAssetName(value?: any): boolean;
export declare function isBitAssetId(value?: any): boolean;
export declare function isDynamicAssetDataId(value?: any): boolean;
export declare function isAccountStatisticsId(value?: any): boolean;
export declare function isTransactionId(value?: any): boolean;
export declare function isBlockSummaryId(value?: any): boolean;
export declare function isAccountTransactionHistoryId(value?: any): boolean;
export declare function isContractHistoryId(value?: any): boolean;
export declare function isContractPoolId(value?: any): boolean;
export declare function isDynamicGlobalObjectId(value?: any): boolean;

export declare function isPublicKey(value?: any): boolean;
export declare function isEchoRandKey(value?: any): boolean;
export declare function isAccountName(value?: any): boolean;
export declare function checkAccountName(value?: any): boolean;
export declare function checkCheapName(value?: any): boolean;
export declare function validateOptionsError(value?: any): boolean;
export declare function isTimePointSec(value?: any): boolean;

export declare function validateAmount(value: number|BigNumber|string): string;
