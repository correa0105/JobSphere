import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';

import persistedReducers from './modules/reduxPersist';
import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({ reducer: persistedReducers(rootReducer), middleware: [sagaMiddleware] });

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };
