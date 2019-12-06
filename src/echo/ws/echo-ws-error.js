export const EchoWSErrorCode = {
	INVALID_API_NAME: 5001,
	FORCE_DISCONNECT: 5002,
	NOT_CONNECTED: 5003,
	DISCONNECTED: 5004,
	UNEXPECTED_RESPONSE_TYPE: 5005,
	UNEXPECTED_RESPONSE_ID_TYPE: 5006,
	UNEXPECTED_RESPONSE_ID: 5007,
	NOTICE_PARAMS_IS_NOT_AN_ARRAY: 5008,
	UNEXPECTED_NOTICE_PARAMS_LENGTH: 5009,
	UNEXPECTED_NOTICE_CALLBACK_ID: 5010,
};

export default class EchoWSError extends Error {

	get name() { return 'EchoWSError'; }

	/**
	 * @param {number} code
	 * @param {string} reason
	 * @param {any} [data]
	 */
	constructor(code, reason, data) {
		super(`ws closed with code ${code} and reason "${reason}"`);
		this.code = code;
		this.reason = reason;
		this.data = data;
	}

}
