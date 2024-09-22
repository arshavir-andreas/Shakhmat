import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AgainstEngineGameState {
    gamePGN: string;
}

const initialState: AgainstEngineGameState = {
    gamePGN: '',
};

export const againstEngineGameSlice = createSlice({
    name: 'againstEngineGame',
    initialState,
    reducers: {
        setGamePGN: (state, action: PayloadAction<string>) => {
            state.gamePGN = action.payload;
        },
    },
});

export const { setGamePGN } = againstEngineGameSlice.actions;

export default againstEngineGameSlice.reducer;
