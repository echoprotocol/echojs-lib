import "babel-polyfill";
import parseuri from 'parseuri';
import WS from '../src/echo/ws/api-instances'

describe('instance', () => {
    describe('#connection()', () => {
        it('should connect to remote socket', async (done) => {
            const ws = new WS();
            try {
                await ws.connect('wss://echo-devnet-node.pixelplex.io/ws', {
                    connectionTimeout: 5000,
                    maxRetries: 10,
                    socketDebug: true,
                    // onOpen: () => { console.log('open') },
                    // onClose: () => { console.log('close') },
                    // onError: () => { console.log('error') },
                });

                await new Promise((res) => {
                    setTimeout(() => { res(); ws.dbApi().exec('get_block', [200]).then(() => {}) }, 10000)
                });

                await new Promise((res) => {
                    setTimeout(() => { res(); ws.dbApi().exec('get_block', [200]).then(() => {}) }, 10000)
                });

                return;
            } catch (e) {
                console.log(e);
                return Promise.reject(e);
            }
        }).timeout(1360000);
    });
});