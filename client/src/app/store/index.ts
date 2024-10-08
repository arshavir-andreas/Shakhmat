import { configureStore } from '@reduxjs/toolkit';
import againstEngineGameSliceReducer from './againstEngineGameSlice';
import userSliceReducer from './userSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer: {
        againstEngineGameSlice: againstEngineGameSliceReducer,
        userSlice: userSliceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
