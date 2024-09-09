import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AgainstEngineGameState {
    isTheGameReady: boolean;
    engineELO: number;
    isTheUserWhite: boolean;
}

const initialState: AgainstEngineGameState = {
    isTheGameReady: false,
    engineELO: 0,
    isTheUserWhite: true,
};

export const againstEngineGameSlice = createSlice({
    name: 'againstEngineGame',
    initialState,
    reducers: {
        setEngineELO: (state, action: PayloadAction<number>) => {
            state.engineELO = action.payload;
        },
        setTheUserColor: (state, action: PayloadAction<'white' | 'black'>) => {
            state.isTheUserWhite = action.payload === 'white';
        },
        startTheGame: (state) => {
            state.isTheGameReady = true;
        },
    },
});

export const { setEngineELO, setTheUserColor, startTheGame } =
    againstEngineGameSlice.actions;

export default againstEngineGameSlice.reducer;
