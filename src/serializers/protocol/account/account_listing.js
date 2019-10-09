import { UInt8Serializer } from '../../basic/integers';

/**
 * @typedef {Object} ACCOUNT_LISTING_t
 * @property {0x0} NO_LISTNING
 * @property {0x1} WHITE_LISTED
 * @property {0x2} BLACK_LISTED
 * @property {0x3} WHITE_AND_BLACK_LISTED
 */
/** @type {ACCOUNT_LISTING_t} */
export const ACCOUNT_LISTING = {
	NO_LISTNING: 0x0,
	WHITE_LISTED: 0x1,
	BLACK_LISTED: 0x2,
	WHITE_AND_BLACK_LISTED: 0x3,
};

export default class AccountListingSerializer extends UInt8Serializer {

	/**
	 * @template {ACCOUNT_LISTING_t[keyof ACCOUNT_LISTING_t]} T
	 * @param {T} value
	 * @returns {T}
	 */
	toRaw(value) {
		const result = super.toRaw(value);
		if (result > 4) throw new Error('invalid account listing');
	}

	appendToByteBuffer() {
		super.appendToByteBuffer();
	}

}
