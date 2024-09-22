import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    userCredentials?: UserCredentials;
}

const initialState: UserState = {
    userCredentials: {
        id: '',
        username: '',
    },
};

export const userSlice = createSlice({
    name: 'againstEngineGame',
    initialState,
    reducers: {
        setUserCredentials: (state, action: PayloadAction<UserCredentials>) => {
            state.userCredentials = action.payload;
        },
    },
});

export const { setUserCredentials } = userSlice.actions;

export default userSlice.reducer;
