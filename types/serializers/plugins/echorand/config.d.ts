import { uint32 } from '../../basic/integers';
import { StructSerializer } from '../../collections';

declare const echorandConfigSerializer:StructSerializer<{
	_time_net_1mb: typeof uint32,
	_time_net_256b: typeof uint32,
	_creator_count: typeof uint32,
	_verifier_count: typeof uint32,
	_ok_threshold: typeof uint32,
	_max_bba_steps: typeof uint32,
	_gc1_delay: typeof uint32,
}>;

export default echorandConfigSerializer;
