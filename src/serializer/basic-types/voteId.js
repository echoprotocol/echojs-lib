import Type from '../type';

class VoteIdType extends Type {

	validate() { super.validate(); }

	appendToByteBuffer() { super.appendToByteBuffer(); }

}

export default new VoteIdType();
