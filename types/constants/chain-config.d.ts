export interface ChainConfig {
    CORE_ASSET: string,
    ADDRESS_PREFIX: string,
    EXPIRE_IN_SECONDS: number,
    EXPIRE_IN_SECONDS_PROPOSAL: number,
    REVIEW_IN_SECONDS_COMMITTEE: number,
    NETWORKS: {
        ECHO_DEV: {
            CORE_ASSET: string,
            ADDRESS_PREFIX: string,
            CHAIN_ID: string,
        },
    },
}
