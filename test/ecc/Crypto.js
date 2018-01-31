import { Aes, PrivateKey, PublicKey, Signature, hash, key } from "../../lib";
import assert from "assert";
import { Long } from 'bytebuffer';
import { ChainConfig } from "../../node_modules/echojs-ws/cjs";

import secureRandom from 'secure-random';

import dictionary from "./dictionary";

describe("ECC", function () {
	before(function () {
		ChainConfig.reset();
	});

	describe("Crypto", function () {

		var encrypted_key =
			"37fd6a251d262ec4c25343016a024a3aec543b7a43a208bf66bc80640dff" +
			"8ac8d52ae4ad7500d067c90f26189f9ee6050a13c087d430d24b88e713f1" +
			"5d32cbd59e61b0e69c75da93f43aabb11039d06f";

		var decrypted_key =
			"ab0cb9a14ecaa3078bfee11ca0420ea2" +
			"3f5d49d7a7c97f7f45c3a520106491f8" + // 64 hex digits
			"00000000000000000000000000000000000000000000000000000000" +
			"00000000";

		it("Decrypt", function () {
			var aes = Aes.fromSeed("Password01")
			var d = aes.decryptHex(encrypted_key)
			assert.equal(decrypted_key, d, "decrypted key does not match")
		})

		it("Encrypt", function () {
			var aes = Aes.fromSeed("Password01")
			var d = aes.encryptHex(decrypted_key)
			assert.equal(encrypted_key, d, "encrypted key does not match")
		})

        /*it "Computes public key", ->
            private_key = PrivateKey.fromHex decrypted_key.substring 0, 64
            public_key = private_key.toPublicKey()
            console.log public_key.toHex());*/

		it("generate private key from seed", function () {
			var private_key = PrivateKey.fromSeed("1");
			assert.equal(private_key.toPublicKey().toString(), "ECHO8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA", "private key does not match");
		})

		it("sign", function () {
			this.timeout(10000);
			var private_key = PrivateKey.fromSeed("1");
			return (() => {
				var result = [];
				for (var i = 0; i < 10; i++) {
					result.push(Signature.signBuffer((new Buffer(i)), private_key));
				}
				return result;
			})();
		});

		it("binary_encryption", function () {
			var sender = PrivateKey.fromSeed("1");
			var receiver = PrivateKey.fromSeed("2");
			var S = sender.get_shared_secret(receiver.toPublicKey());
			var nonce = "289662526069530675";

			var ciphertext = Aes.encrypt_with_checksum(
				sender,
				receiver.toPublicKey(),
				nonce,
				new Buffer("\xff\x00", 'binary')
			);
			//console.log '... ciphertext',ciphertext
			var plaintext = Aes.decrypt_with_checksum(
				receiver,
				sender.toPublicKey(),
				nonce,
				ciphertext
			);
			//console.log '... plaintext',plaintext.toString()
			assert.equal("ff00", plaintext.toString('hex'));
		});

		// time-based, probably want to keep these last
		it("key_checksum", function () {
			this.timeout(1500);
			return min_time_elapsed(function () {
				var key_checksum = key.aes_checksum("password").checksum;
				assert.equal(
					true,
					key_checksum.length > 4 + 4 + 2,
					"key_checksum too short"
				);
				assert.equal(3, key_checksum.split(',').length);
			});
		});

		it("key_checksum with aes_private", function (done) {
			this.timeout(1500);
			return min_time_elapsed(function () {
				var aes_checksum = key.aes_checksum("password");
				var aes_private = aes_checksum.aes_private;
				var key_checksum = aes_checksum.checksum;
				assert(aes_private !== null);
				assert(typeof aes_private["decrypt"] === 'function');
				assert.equal(
					true,
					key_checksum.length > 4 + 4 + 2,
					"key_checksum too short"
				);
				assert.equal(3, key_checksum.split(',').length);
				return done();
			});
		});
		// DEBUG console.log('... key_checksum',key_checksum)

		it("wrong password", function () {
			this.timeout(2500);
			var key_checksum = min_time_elapsed(function () {
				return key.aes_checksum("password").checksum;
			});
			// DEBUG console.log('... key_checksum',key_checksum)
			assert.throws(() =>
				min_time_elapsed(function () {
					key.aes_private("bad password", key_checksum);
				})
				, "wrong password")
		});

		it("password aes_private", function () {
			this.timeout(2500);
			var key_checksum = min_time_elapsed(function () {
				return key.aes_checksum("password").checksum;
			});

			var password_aes = min_time_elapsed(function () {
				return key.aes_private("password", key_checksum);
			});

			// DEBUG console.log('... password_aes',password_aes)
			assert(password_aes !== null);
		});

	})

	describe("Derivation", () => {

		let one_time_private = PrivateKey.fromHex("8fdfdde486f696fd7c6313325e14d3ff0c34b6e2c390d1944cbfe150f4457168")
		let to_public = PublicKey.fromStringOrThrow("ECHO7vbxtK1WaZqXsiCHPcjVFBewVj8HFRd5Z5XZDpN6Pvb2dZcMqK")
		let secret = one_time_private.get_shared_secret(to_public)
		let child = hash.sha256(secret)

		// Check everything above with `wdump((child));` from the witness_node:
		assert.equal(child.toString('hex'), "1f296fa48172d9af63ef3fb6da8e369e6cc33c1fb7c164207a3549b39e8ef698")

		let nonce = hash.sha256(one_time_private.toBuffer())
		assert.equal(nonce.toString('hex'), "462f6c19ece033b5a3dba09f1e1d7935a5302e4d1eac0a84489cdc8339233fbf")

		it("child from public", function () {
			assert.equal(
				to_public.child(child).toString(),
				"ECHO6XA72XARQCain961PCJnXiKYdEMrndNGago2PV5bcUiVyzJ6iL",
				"derive child public key"
			);
		});

		// child = sha256( one_time_private.get_secret( to_public ))
		it("child from private", function () {
			assert.equal(
				PrivateKey.fromSeed("alice-brain-key").child(child).toPublicKey().toString(),
				"ECHO6XA72XARQCain961PCJnXiKYdEMrndNGago2PV5bcUiVyzJ6iL",
				"derive child from private key"
			)
		})

		it("Suggest brainkey", function () {
			let brainKey = key.suggest_brain_key(dictionary.en);
			assert.equal(16, brainKey.split(" ").length);
		})



		// "many keys" works, not really needed
		// it("many keys", function() {
		//
		//     this.timeout(10 * 1000)
		//
		//     for (var i = 0; i < 10; i++) {
		//         let privkey1 = key.get_random_key()
		//         let privkey2 = key.get_random_key()
		//
		//         let secret1 = one_time_private.get_shared_secret( privkey1.toPublicKey() )
		//         let child1 = sha256( secret1 )
		//
		//         let secret2 = privkey2.get_shared_secret( privkey2.toPublicKey() )
		//         let child2 = sha256( secret2 )
		//
		//         it("child from public", ()=> assert.equal(
		//             privkey1.toPublicKey().child(child1).toString(),
		//             privkey2.toPublicKey().child(child2).toString(),
		//             "derive child public key"
		//         ))
		//
		//         it("child from private", ()=> assert.equal(
		//             privkey1.child(child1).toString(),
		//             privkey2.child(child2).toString(),
		//             "derive child private key"
		//         ))
		//     }
		//
		// })

	})
});

var min_time_elapsed = function (f) {
	var start_t = Date.now();
	var ret = f();
	var elapsed = Date.now() - start_t;
	assert.equal(
		// repeat operations may take less time
		elapsed >= 250 * 0.8, true,
		`minimum time requirement was not met, instead only ${elapsed / 1000.0} elapsed`
	);
	return ret;
};
