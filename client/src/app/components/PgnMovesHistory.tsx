import { RootState, useAppSelector } from "../store";

export default function PgnMovesHistory() {
    const gamePgn = useAppSelector((state: RootState) => state.againstEngineGameSlice.gamePGN);

    return (
        <div className=" font-bold">
            {gamePgn}
        </div>
    );
}
