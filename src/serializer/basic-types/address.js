import Type from '../type';

class AddressType extends Type {

	validate() { super.validate(); }

	appendToByteBuffer() { super.appendToByteBuffer(); }

}

export default new AddressType();
