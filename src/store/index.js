import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
// # Reducers
import authReducer from "src/store/auth";
import navReducer from "src/store/NavCollpase";

//
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["nav"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  nav: navReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
});

export const persistor = persistStore(store);
