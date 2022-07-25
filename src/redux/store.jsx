import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { createLogger } from "redux-logger";
import rpm from "redux-promise-middleware";
import storage from "redux-persist/lib/storage";
import reducers from "./reducers";
import thunk from "redux-thunk";

// redux persist config start
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

// redux-logger middleware
const logger = createLogger();
const middlewares = applyMiddleware(rpm, thunk, logger);

export let store = createStore(persistedReducer, compose(middlewares));
export let persistor = persistStore(store);