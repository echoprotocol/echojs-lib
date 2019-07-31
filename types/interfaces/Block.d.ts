import Transaction from './Transaction';

export default interface Block {
    previous: string,
    timestamp: string,
    account: string,
    transaction_merkle_root: string,
    state_root_hash: string,
    result_root_hash:string ,
    extensions: array,
    ed_signature: string,
    round: number,
    rand: string,
    cert: Object,
    transactions: Array<Transaction>
}