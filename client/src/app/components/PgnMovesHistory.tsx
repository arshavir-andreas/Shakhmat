import { RootState, useAppSelector } from "../store";

export default function PgnMovesHistory() {
    const gamePgn = useAppSelector((state: RootState) => state.againstEngineGameSlice.gamePGN);

    return (
        <div className=" font-bold m-[20px] min-w-[25%]">
            {gamePgn}
        </div>
    );
}
