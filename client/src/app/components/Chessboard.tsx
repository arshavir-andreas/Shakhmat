import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useAppSelector } from '../store';
import { RootState } from '../store';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';

export default function Chessboard() {
    const isTheUserWhite = useAppSelector((state: RootState) => state.againstEngineGameSlice.isTheUserWhite);

    const engineElO = useAppSelector((state: RootState) => state.againstEngineGameSlice.engineELO);

    const isTheGameReady = useAppSelector((state: RootState) => state.againstEngineGameSlice.isTheGameReady);

    const [isWhiteTurn, setIsWhiteTurn] = useState(true);

    useEffect(() => {
        setIsWhiteTurn(false);
    }, []);

    return (
        <div>
            <div className=" font-bold text-[18px]">
                {isTheGameReady ? `Engine ${engineElO}` : ''}
            </div>

            <div className=" w-[300px] sm:w-[650px] my-[10px]">
                <ReactChessboard
                    showBoardNotation={false}
                    boardOrientation={isTheUserWhite ? `white` : `black`}
                    arePiecesDraggable={false}
                    areArrowsAllowed={false}
                    autoPromoteToQueen={false}
                    showPromotionDialog={false}
                />
            </div>


            <div className=" font-bold text-[18px]">
                {isTheGameReady ? `User` : ''}
            </div>

            {
                isTheGameReady ? (
                    <div>
                        <label htmlFor="user-move">Move: </label>

                        <InputText
                            id="user-move"
                            disabled={(isTheUserWhite && !isWhiteTurn) || (!isTheUserWhite && isWhiteTurn)} 
                        />
                    </div>
                ) : (
                    <></>
                )
            }            
        </div>
    );
}
