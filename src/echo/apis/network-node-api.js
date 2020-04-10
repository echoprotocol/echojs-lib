import { CHAIN_API } from '../../constants/ws-constants';
import BaseEchoApi from './base-api';

/** @typedef {import("../providers").WsProvider} WsProvider */
/** @typedef {import("../providers").HttpProvider} HttpProvider */
/** @typedef {"" | "eth" | "btc"} SidechainType */

/** @typedef {
	import("../../constants/net/peer-database").e_POTENTIAL_PEER_LAST_CONNECTION_DISPOSITION
} e_POTENTIAL_PEER_LAST_CONNECTION_DISPOSITION */

/**
 * @typedef {Object} PeerDetails
 * @property {string} addr
 * @property {string} addrlocal
 * @property {string} services
 * @property {number} lastsend
 * @property {number} lastrecv
 * @property {number | string} bytessent
 * @property {number | string} bytesrecv
 * @property {string} conntime
 * @property {string} pingtime
 * @property {string} pingwait
 * @property {string} version
 * @property {string} subver
 * @property {boolean} inbound
 * @property {import("../../constants/net/core-messages").e_FIREWALLED_STATE} firewall_status
 * @property {string} startingheight
 * @property {string} banscore
 * @property {string} syncnode
 * @property {string} [fc_git_revision_sha]
 * @property {string} [fc_git_revision_unix_timestamp]
 * @property {string} [fc_git_revision_age]
 * @property {string} [platform]
 * @property {string} current_head_block
 * @property {number} current_head_block_number
 * @property {string} current_head_block_time
 */

/**
 * @typedef {Object} PotentialPeerRecord
 * @property {string} endpoint
 * @property {string} last_seen_time
 * @property {e_POTENTIAL_PEER_LAST_CONNECTION_DISPOSITION} last_connection_disposition
 * @property {string} last_connection_attempt_time
 * @property {number} number_of_successful_connection_attempts
 * @property {number} number_of_failed_connection_attempts
 * @property {unknown} [last_error]
 */

class NetworkNodeAPI extends BaseEchoApi {

	/**
	 * @constructor
	 * @param {WsProvider | HttpProvider} provider
	 */
	constructor(provider) {
		super(provider, CHAIN_API.NETWORK_NODE_API);
	}

	/**
	 * @method getConnectedPeers
	 * @return {Promise<Array<{ version: number, host: string, info: PeerDetails }>>}
	 */
	getConnectedPeers() { return this.exec('get_connected_peers', []); }

	/**
	 * @method getPotentialPeers
	 * @return {Promise<PotentialPeerRecord[]>}
	 */
	getPotentialPeers() { return this.exec('get_potential_peers', []); }

}

export default NetworkNodeAPI;
