import { UInt8Serializer } from '../../basic/integers';

export const ACCOUNT_LISTING = {
	NO_LISTNING: 0x0,
	WHITE_LISTED: 0x1,
	BLACK_LISTED: 0x2,
	WHITE_AND_BLACK_LISTED: 0x3,
};

export default class AccountListingSerializer extends UInt8Serializer {

	/**
	 * @param {TInput<T>} value
	 * @returns {TOutput<T>}
	 */
	toRaw(value) {
		const result = super.toRaw(value);
		if (result > 4) throw new Error('invalid account listing');
	}

	/**
	 *
	 */
	appendToByteBuffer() {
		super.appendToByteBuffer();
	}

}
