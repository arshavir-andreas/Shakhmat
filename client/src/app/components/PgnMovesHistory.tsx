import { Button } from 'primereact/button';
import { RootState, useAppSelector } from '../store';
import dayjs from 'dayjs';

type PgnMovesHistoryProps = {
    engine: EngineDetails;
    username: string;
    createdAt: string;
};

export default function PgnMovesHistory({ engine, username, createdAt, }: PgnMovesHistoryProps) {
    const gamePgn = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.gamePGN
    );

    const result = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.result
    );

    function exportToPgn() {
        const white = {
            name: engine.isWhite ? engine.name : username,
            ELO: engine.isWhite ? engine.ELO : '?',
        };

        const black = {
            name: !engine.isWhite ? engine.name : username,
            ELO: !engine.isWhite ? engine.ELO : '?',
        };

        const textContent = 
            `[Date "${dayjs(createdAt).format('YYYY.MM.DD')}"]\n` + 
            `[White "${white.name}"]\n` + 
            `[Black "${black.name}"]\n` + 
            `[Result "${result}"]\n` + 
            `[WhiteElo "${white.ELO}"]\n` + 
            `[BlackElo "${black.ELO}"]\n` + 
            `${gamePgn} ${result}\n`
        ;

        const blob = new Blob([textContent], { 
            type: 'text/plain',
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `shakhmat_${white.name}_vs_${black.name}_${dayjs().format('YYYY_MM_DD')}.pgn`;
        link.click();

        URL.revokeObjectURL(link.href);
    }

    return (
        <div className=" m-[20px] min-w-[25%]">
            <div className=" font-bold">
                {gamePgn} {result === '*' ? '' : result}
            </div>

            {
                result !== '*' ? (
                    <div className=" mt-[100px]">
                        <Button onClick={() => exportToPgn()}>Export to PGN</Button>
                    </div>
                ) : (
                    <></>
                )
            }
        </div>
    );
}
