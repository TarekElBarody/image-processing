import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from '../../types/user.type';

interface UserState {
    isLoggedIn: boolean;
    currentUser: IUser;
    token: string;
}

const initialState: UserState = {
    isLoggedIn: false,
    currentUser: {},
    token: ''
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        userLoggedIN(state, action: PayloadAction<boolean>) {
           state.isLoggedIn = action.payload;
         
        },

        userToken(state, action: PayloadAction<string>) {
           state.token = action.payload;
         
        },

        userData(state, action: PayloadAction<IUser>) {
           state.currentUser = action.payload;
         
        }
    }
});


export const { userLoggedIN , userData, userToken } = userSlice.actions;

export default userSlice.reducer;
