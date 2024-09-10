import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useAppSelector } from '../store';
import { RootState } from '../store';
import { InputText } from 'primereact/inputtext';
import {
    FormEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { fetcherIncludingCredentials } from '../utils/axios-fetchers';
import { Chess } from 'chess.js';
import { Button } from 'primereact/button';
import FinishedGamePopUp from './FinishedGamePopUp';
import { Toast } from 'primereact/toast';

export default function Chessboard() {
    const isTheUserWhite = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.isTheUserWhite,
    );

    const engineElO = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.engineELO,
    );

    const isTheGameReady = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.isTheGameReady,
    );

    const [isWhiteTurn, setIsWhiteTurn] = useState(true);

    const game = useMemo(() => {
        return new Chess();
    }, []);

    const [gamePosition, setGamePosition] = useState(game.fen());

    const [userMove, setUserMove] = useState('');

    const userMoveInputRef = useRef<HTMLInputElement>(null);

    const [finishedGameStatus, setFinishedGameStatus] = useState<
        FinishedGameStatus | undefined
    >(undefined);

    const [isFinishedGamePopUpVisible, setIsFinishedGamePopUpVisible] =
        useState(false);

    const isUserMoveInputDisabled = useMemo(() => {
        return (
            (isTheUserWhite && !isWhiteTurn) ||
            (!isTheUserWhite && isWhiteTurn) ||
            finishedGameStatus !== undefined
        );
    }, [finishedGameStatus, isTheUserWhite, isWhiteTurn]);

    const userMoveErrorToast = useRef<Toast>(null!);

    const checkGameStatus = useCallback(() => {
        if (game.isCheckmate()) {
            setFinishedGameStatus({
                winner: isWhiteTurn ? `white` : `black`,
            });

            setIsFinishedGamePopUpVisible(true);
        }

        if (game.isDraw()) {
            setFinishedGameStatus({
                winner: undefined,
            });

            setIsFinishedGamePopUpVisible(true);
        }
    }, [game, isWhiteTurn]);

    useEffect(() => {
        async function getEngineBestMove() {
            const positionToEvaluate: PositionToEvaluate = {
                engineELO: engineElO,
                fenPosition: game.fen(),
            };

            const { data } = (await fetcherIncludingCredentials.post(
                `/engines/arasan/best-move`,
                {
                    ...positionToEvaluate,
                },
            )) as { data: EngineResponse };

            game.move({ ...data }, { strict: true });

            setGamePosition(game.fen());

            checkGameStatus();
        }

        if (finishedGameStatus !== undefined) {
            return;
        }

        if (isWhiteTurn && !isTheUserWhite) {
            getEngineBestMove();

            if (finishedGameStatus === undefined) {
                setIsWhiteTurn(false);
            }
        } else if (!isWhiteTurn && isTheUserWhite) {
            getEngineBestMove();

            if (finishedGameStatus === undefined) {
                setIsWhiteTurn(true);
            }
        }
    }, [
        checkGameStatus,
        engineElO,
        finishedGameStatus,
        game,
        isTheUserWhite,
        isWhiteTurn,
    ]);

    useEffect(() => {
        if (isTheGameReady && userMoveInputRef.current !== null) {
            if (
                (isTheUserWhite && isWhiteTurn) ||
                (!isTheUserWhite && !isWhiteTurn)
            ) {
                userMoveInputRef.current.focus();
            }
        }
    }, [isTheGameReady, isTheUserWhite, isWhiteTurn]);

    function handleUserMove(e: FormEvent) {
        e.preventDefault();

        try {
            game.move(userMove, { strict: true });

            setUserMove('');

            setGamePosition(game.fen());

            checkGameStatus();

            if (isTheUserWhite && isWhiteTurn) {
                setIsWhiteTurn(false);
            } else if (!isTheUserWhite && !isWhiteTurn) {
                setIsWhiteTurn(true);
            }
        } catch (error) {
            userMoveErrorToast.current.show({
                severity: 'error',
                summary: 'Input error',
                detail: `Invalid move "${userMove}"!`,
                life: 2500,
            });
        }
    }

    return (
        <div>
            <FinishedGamePopUp
                isThePopUpVisible={isFinishedGamePopUpVisible}
                setIsThePopUpVisible={setIsFinishedGamePopUpVisible}
                status={finishedGameStatus}
            />

            <div className=" font-bold text-[18px]">
                {isTheGameReady ? (
                    <span>
                        Engine {engineElO}{' '}
                        {((isWhiteTurn && !isTheUserWhite) ||
                            (!isWhiteTurn && isTheUserWhite)) &&
                        finishedGameStatus === undefined
                            ? `(Thinking...)`
                            : ``}
                    </span>
                ) : (
                    <></>
                )}
            </div>

            <div className=" w-[300px] sm:w-[650px] my-[10px]">
                <ReactChessboard
                    position={gamePosition}
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

            {isTheGameReady ? (
                <form
                    onSubmit={handleUserMove}
                    className=" flex items-center mt-[10px]"
                >
                    <label
                        htmlFor="user-move"
                        className=" mr-[10px]"
                    >
                        Move:
                    </label>

                    <InputText
                        id="user-move"
                        ref={userMoveInputRef}
                        value={userMove}
                        onChange={(e) => setUserMove(e.target.value)}
                        disabled={isUserMoveInputDisabled}
                        className="w-[200px] sm:w-[400px]"
                    />

                    <Button
                        type="submit"
                        className=" ml-[10px]"
                        disabled={isUserMoveInputDisabled}
                    >
                        Go
                    </Button>
                </form>
            ) : (
                <></>
            )}

            <Toast
                ref={userMoveErrorToast}
                position="center"
            />
        </div>
    );
}
