import { bytes, string } from '../basic';
import { optional, pair, vector } from '../collections';

const nodeRlps = vector(optional(bytes()));
const nodeWithRlp = pair(nodeRlps, optional(string));
export const spvPmTrieNodesRlpData = vector(nodeWithRlp);

export default { spvPmTrieNodesRlpData };
