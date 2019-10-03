export default interface FrozenBalance {
    id: string,
    owner: string,
    balance: { amount: number, asset_id: string },
    multiplier: number,
    unfreeze_time: Date,
    extensions: Array<any>
}
