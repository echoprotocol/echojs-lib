import { StringSerializer } from './basic';
import { StructSerializer, VectorSerializer } from './collections';

declare const approvalDelta : StructSerializer<{
    active_approvals_to_add: VectorSerializer<StringSerializer>,
    active_approvals_to_remove: VectorSerializer<StringSerializer>,
    owner_approvals_to_add: VectorSerializer<StringSerializer>,
    owner_approvals_to_remove: VectorSerializer<StringSerializer>,
    key_approvals_to_add: VectorSerializer<StringSerializer>,
    key_approvals_to_remove: VectorSerializer<StringSerializer>,
}>;

export default approvalDelta;
