import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import LoginReducer from './user/loginSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        login: LoginReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
