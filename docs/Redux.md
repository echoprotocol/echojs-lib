## Table of contents

- [Redux](#redux)

### Redux
We provide redux store update automatically.

Now we create store, import and implement echo reducers and sync store wit lib.
```javascript
import echo, { echoReducer, constants } from "echojs-lib";

import { combineReducers, createStore } from 'redux';

const { CACHE_MAPS } = constants;
// array of caches you want to follow, or if this parameters empty, sync redux with whole cache
const caches = [CACHE_MAPS.OBJECTS_BY_ID, CACHE_MAPS.FULL_ACCOUNTS] 

const store = createStore(
                combineReducers({
                    ...reducers,
                    cache: echoReducer(caches), // return reducer
                })
           );

echo.syncCacheWithStore(store);

console.log(store.cache.get(CACHE_MAPS.OBJECTS_BY_ID));
```
> All objects after and before sync, will be added to redux store.
