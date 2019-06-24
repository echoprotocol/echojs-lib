const assert = require('assert');
const bs58 = require('bs58');
const { Apis } = require("echojs-ws");
const { ChainStore, ED25519 } = require('../../index');

describe("API", () => {
    it("Create account", () => {
        return Apis.instance('wss://testnet.echo-dev.io/ws/', true).init_promise.then((res) => {
            const EchoRandKeyBuffer = ED25519.createKeyPair();
            const echoRandPublicKey = EchoRandKeyBuffer.publicKey;
            const echoRandKey = `DET${bs58.encode(echoRandPublicKey)}`;
            const name = 'qweqwe' + Date.now();
            const result = res[3].exec(
                'register_account',
                [() => {}, name, echoRandKey, echoRandKey, 'ECHO1111111111111111111111111111111114T1Anm', echoRandKey],
            );
            result.then((res) => console.log('RESULT', res)).catch((err) => console.log('ERROR', JSON.stringify(err)));
        });
    });
});
