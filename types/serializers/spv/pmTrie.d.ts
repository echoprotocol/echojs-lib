import { BytesSerializer, StringSerializer } from "../basic";
import { OptionalSerializer, VectorSerializer } from "../collections";
import PairSerializer from "../collections/Pair";

declare const nodeRlps: VectorSerializer<OptionalSerializer<BytesSerializer>>;
declare const nodeWithRlp: PairSerializer<typeof nodeRlps, OptionalSerializer<StringSerializer>>;
export const spvPmTrieNodesRlpData: VectorSerializer<typeof nodeWithRlp>;
