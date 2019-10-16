import { UInt8Serializer } from '../../basic/integers';

export enum ACCOUNT_LISTING {
    NO_LISTNING =  0x0,
    WHITE_LISTED = 0x1,
    BLACK_LISTED = 0x2,
    WHITE_AND_BLACK_LISTED = 0x3,
}

export default class AccountListingSerializer extends UInt8Serializer {
    toRaw(value: ACCOUNT_LISTING): ACCOUNT_LISTING;
}
