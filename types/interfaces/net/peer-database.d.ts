import { POTENTIAL_PEER_LAST_CONNECTION_DISPOSITION } from "../../constants/net/peer-database";

export interface PotentialPeerRecord {
	endpoint: string;
	last_seen_time: string;
	last_connection_disposition: POTENTIAL_PEER_LAST_CONNECTION_DISPOSITION;
	last_connection_attempt_time: string;
	number_of_successful_connection_attempts: number;
	number_of_failed_connection_attempts: number;
	last_error?: unknown;
}
