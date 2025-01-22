import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk, ThunkDispatch } from "redux-thunk";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from "redux-persist";
import  authSlice from "./authSlice";
import { useDispatch } from "react-redux";


const persistConfig = {
    key: 'seproac-root',
    storage
}

const reducers = combineReducers({
    auth: authSlice
});

const persistedReducers = persistReducer(persistConfig, reducers);

// const persist;
export const store = configureStore({
    reducer: persistedReducers,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
});


export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type appThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<appThunkDispatch>();
