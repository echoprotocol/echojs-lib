import { uint32 } from '../../basic/integers';
import { struct } from '../../collections';

const echorandConfigSerializer = struct({
	_time_net_1mb: uint32,
	_time_net_256b: uint32,
	_creator_count: uint32,
	_verifier_count: uint32,
	_ok_threshold: uint32,
	_max_bba_steps: uint32,
	_gc1_delay: uint32,
});

export default echorandConfigSerializer;
