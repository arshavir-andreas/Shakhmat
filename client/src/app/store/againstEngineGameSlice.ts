import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AgainstEngineGameState {
    gamePGN: string;
    result: string;
}

const initialState: AgainstEngineGameState = {
    gamePGN: '',
    result: '*',
};

export const againstEngineGameSlice = createSlice({
    name: 'againstEngineGame',
    initialState,
    reducers: {
        setGamePGN: (state, action: PayloadAction<string>) => {
            state.gamePGN = action.payload;
        },
        setResult: (state, action: PayloadAction<string>) => {
            state.result = action.payload;
        },
    },
});

export const { setGamePGN, setResult, } = againstEngineGameSlice.actions;

export default againstEngineGameSlice.reducer;
