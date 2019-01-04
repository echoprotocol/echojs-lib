import Type from '../type';

class AddressType extends Type {

	validate() { super.validate(); }

	appendToByteBuffer() { super.appendToByteBuffer(); }

}

const address = new AddressType();

export default address;
