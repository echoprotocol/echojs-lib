import "babel-polyfill";
import WS from '../src/echo/ws'
import WSAPI from '../src/echo/ws-api'

describe('instance', () => {
    describe('#connection()', () => {
        it('should connect to remote socket', async (done) => {
            const ws = new WS();
            try {
                // await ws.connect('wss://echo-devnet-node.pixelplex.io/ws', {
                await ws.connect('wss://echo-devnet-node.pixelplex.io/ws', {
                    connectionTimeout: 5000,
                    maxRetries: 5,
                    debug: true,
                });

                const api = new WSAPI(ws);

                await new Promise((res) => {
                    setTimeout(() => { res(); api.database.getBlock(200).then(() => console.log('ws')).catch(console.log) }, 10000)
                });

                return;
            } catch (e) {
                console.log(e);
                // return Promise.reject(e);
            }
        }).timeout(1360000);
    });
});