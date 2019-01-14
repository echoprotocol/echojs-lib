import { expect } from 'chai';
import { Echo } from '../index';
import { encode } from 'bs58';

import { combineReducers, createStore } from 'redux';

import cacheReducer from '../src/redux/reducer'

const defaultReducer = (state = {}, { type, payload }) => type === 'SET' ? { ...state, ...payload } : state;

// console.log(store.getState())

describe('redux', () => {
    describe(('create reducer'), () => {
        it('pass not array and throw caches is invalid', (done) => {
            try {
                const caches = '';
                cacheReducer(caches);
            } catch (err) {
                expect(err.message).to.equal('Caches is invalid');
                done();
            }

        });

        it('pass not string array and throw caches is invalid', (done) => {
            try {
                const caches = [1];
                cacheReducer(caches);
            } catch (err) {
                expect(err.message).to.equal('Caches is invalid');
                done();
            }

        });

        it('pass valid array and return function', () => {
            const caches = ['objectsById'];
            expect(cacheReducer(caches)).to.be.an('function');
        });

        it('create store and pass cache reducer', () => {
            const caches = ['objectsById'];

            const store = createStore(
                combineReducers({
                    defaultReducer,
                    cache: cacheReducer(caches),
                })
            );

            const state = store.getState();

            expect(state).to.have.property('cache')
        });

        it('state contain passed params', () => {
            const caches = ['objectsById'];

            const store = createStore(
                combineReducers({
                    defaultReducer,
                    cache: cacheReducer(caches),
                })
            );

            const { cache } = store.getState();

            expect(cache.toJS()).to.have.property('objectsById');
        });
    })

    describe('update redux', () => {
        let echo;
        beforeEach(async () => {
            echo = new Echo();
            await echo.connect(
                'ws://195.201.164.54:6311',
                {
                    apis: [
                        'database',
                        'network_broadcast',
                        'history',
                        'registration',
                        'asset',
                        'login',
                        'network_node',
                    ],
                },
            );
        });

        afterEach( async () => {
            await echo.disconnect();
        });

        it('state doest update when call get account', async () => {
            const caches = ['objectsById'];

            const store = createStore(
                combineReducers({
                    defaultReducer,
                    cache: cacheReducer(caches),
                })
            );

            const id = '1.2.0';

            await echo.api.getObjects([id])

            const { cache } = store.getState();

            expect(cache.getIn(['objectsById', id])).to.be.an('undefined');
        });

        it('implement store to cache', async () => {
            const caches = ['objectsById'];

            const store = createStore(
                combineReducers({
                    defaultReducer,
                    cache: cacheReducer(caches),
                })
            );

            echo.syncCacheWithStore(store);

            expect(echo.cache.redux).to.have.property('store', store);
        });

        it('state does update when call get object', async () => {
            const caches = ['objectsById'];

            const store = createStore(
                combineReducers({
                    defaultReducer,
                    cache: cacheReducer(caches),
                })
            );

            echo.syncCacheWithStore(store);

            const id = '1.2.0';

            const account = await echo.api.getObject(id);

            const { cache } = store.getState();

            expect(cache.getIn(['objectsById', id])).to.deep.equal(account);
        });
    });
});


