import { CHAIN_API } from '../../constants/ws-constants';
import BaseEchoApi from './base-api';

/** @typedef {import("../providers").WsProvider} WsProvider */
/** @typedef {import("../providers").HttpProvider} HttpProvider */
/** @typedef {"" | "eth" | "btc"} SidechainType */

class LoginAPI extends BaseEchoApi {

	/** @param {WsProvider | HttpProvider} provider */
	constructor(provider) {
		super(provider, CHAIN_API.LOGIN_API);
	}

}

export default LoginAPI;
