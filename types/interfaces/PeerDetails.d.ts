import { FIREWALLED_STATE } from "../constants/net/core-messages";

export default interface PeerDetails {
	addr: string;
	addrlocal: string;
	services: string;
	lastsend: number;
	lastrecv: number;
	bytessent: number | string;
	bytesrecv: number | string;
	conntime: string;
	pingtime: string;
	pingwait: string;
	version: string;
	subver: string;
	inbound: boolean;
	firewall_status: FIREWALLED_STATE;
	startingheight: string;
	banscore: string;
	syncnode: string;
	fc_git_revision_sha?: string;
	fc_git_revision_unix_timestamp?: string;
	fc_git_revision_age?: string;
	platform?: string;
	current_head_block: string;
	current_head_block_number: number;
	current_head_block_time: string;
}
