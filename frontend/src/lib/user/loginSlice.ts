import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
    email: string;
    password: string;
    loading: boolean;
    message: string;
}

const initialState: LoginState = {
    email: '',
    password: '',
    loading: false,
    message: ''
};

const LoginSlice = createSlice({
    name: 'Login',
    initialState,
    reducers: {
        emailSetter(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },

        passwordSetter(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        loadingSetter(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        messageSetter(state, action: PayloadAction<string>) {
            state.message = action.payload;
        }
    }
});

export const { emailSetter, passwordSetter, loadingSetter, messageSetter } = LoginSlice.actions;

export default LoginSlice.reducer;
