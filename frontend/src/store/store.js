import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import dataReducer from './slices/dataSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        data: dataReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['data/setCache'],
                ignoredPaths: ['data.cache'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;