import Type from '../type';

class VoteIdType extends Type {

	validate() { super.validate(); }

	appendToByteBuffer() { super.appendToByteBuffer(); }

}

const voteId = new VoteIdType();

export default voteId;
