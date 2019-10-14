export default interface BtcAddress {
    id: string,
    account: string,
    deposit_address: { address: string },
    committee_member_ids_in_script: Array<string>,
    backup_address: string,
    extensions: Array<any>
}