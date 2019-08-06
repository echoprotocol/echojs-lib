export interface RESERVED_SPACES {
    RELATIVE_PROTOCOL_IDS: number,
    PROTOCOL_IDS: number,
    IMPLEMENTATION_IDS: number,
}

export interface IMPLEMENTATION_OBJECT_TYPE {
    GLOBAL_PROPERTY: number,
    DYNAMIC_GLOBAL_PROPERTY: number,
    RESERVED: number,
    ASSET_DYNAMIC_DATA: number,
    ASSET_BITASSET_DATA: number,
    ACCOUNT_BALANCE: number,
    ACCOUNT_STATISTICS: number,
    TRANSACTION: number,
    BLOCK_SUMMARY: number,
    ACCOUNT_TRANSACTION_HISTORY: number,
    CHAIN_PROPERTY: number,
    BUDGET_RECORD: number,
    SPECIAL_AUTHORITY: number,
    BUYBACK_OBJECT: number,
    COLLATERAL_BID: number,
    CONTRACT_BALANCE: number,
    CONTRACT_HISTORY: number,
    CONTRACT_STATISTICS: number,
    ACCOUNT_ADDRESS: number,
    CONTRACT_POOL: number,
    MALICIOUS_COMMITTEEMEN: number,
}

export interface VOTE_TYPE {
    COMMITTEE: number,
}
