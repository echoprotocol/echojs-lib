import { StructSerializer } from "../collections";


      asset            fee;
      /// Account to transfer asset from
      account_id_type  from;
      /// Account to transfer asset to
      account_id_type  to;
      /// The amount of asset to transfer from @ref from to @ref to
      asset            amount;

      extensions_type   extensions;

interface StructSerializers {
	fee: 
}

export default class TransferSerializer extends StructSerializer<> {

}
