import { Chessboard as ReactChessboard } from 'react-chessboard';
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
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../store';
import { setGamePGN } from '../store/againstEngineGameSlice';

type ChessboardProps = {
    engine: EngineDetails;
    pgn: string;
};

export default function Chessboard({ engine, pgn }: ChessboardProps) {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const [isWhiteTurn, setIsWhiteTurn] = useState(true);

    const game = useMemo(() => {
        const newGame = new Chess();

        newGame.loadPgn(pgn);

        return newGame;
    }, [pgn]);

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
            (!engine.isWhite && !isWhiteTurn) ||
            (engine.isWhite && isWhiteTurn) ||
            finishedGameStatus !== undefined
        );
    }, [finishedGameStatus, engine.isWhite, isWhiteTurn]);

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

    const getEngineBestMove = useCallback(async () => {
        const positionToEvaluate: PositionToEvaluate = {
            engineId: engine.id,
            engineELO: engine.ELO,
            fenPosition: game.fen(),
        };

        try {
            const { data } = (await fetcherIncludingCredentials.post(
                `/engines/best-move`,
                {
                    ...positionToEvaluate,
                },
            )) as { data: EngineResponse };

            game.move({ ...data }, { strict: true });

            setGamePosition(game.fen());

            dispatch(setGamePGN(game.pgn()));

            checkGameStatus();
        } catch (error) {
            console.log(error);
            
            const axiosError = (error as AxiosError).response
                ?.data as ErrorDetails;

            switch (axiosError.statusCode) {
                case 401:
                    router.push(`/login`);

                    break;
                default:
                    console.log(axiosError);

                    break;
            }
        } finally {
        }  
    }, [checkGameStatus, dispatch, engine, game, router]);

    useEffect(() => {
        async function engineGame() {
            if (finishedGameStatus !== undefined) {
                return;
            }
    
            if (isWhiteTurn && engine.isWhite) {
                await getEngineBestMove();
    
                if (finishedGameStatus === undefined) {
                    setIsWhiteTurn(false);
                }
            } else if (!isWhiteTurn && !engine.isWhite) {
                await getEngineBestMove();
    
                if (finishedGameStatus === undefined) {
                    setIsWhiteTurn(true);
                }
            }
        }

        engineGame();
    }, [engine, finishedGameStatus, getEngineBestMove, isWhiteTurn]);

    useEffect(() => {        
        if (userMoveInputRef.current !== null) {
            if (
                (!engine.isWhite && isWhiteTurn) ||
                (engine.isWhite && !isWhiteTurn)
            ) {
                userMoveInputRef.current.focus();
            }
        }
    }, [engine, isWhiteTurn]);

    function handleUserMove(e: FormEvent) {
        e.preventDefault();

        try {
            game.move(userMove, { strict: true });

            setUserMove('');

            setGamePosition(game.fen());

            dispatch(setGamePGN(game.pgn()));

            checkGameStatus();

            if (!engine.isWhite && isWhiteTurn) {
                setIsWhiteTurn(false);
            } else if (engine.isWhite && !isWhiteTurn) {
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
                <span>
                    {engine.name} {`(${engine.ELO} ELO)`}{' '}
                    {((isWhiteTurn && engine.isWhite) ||
                        (!isWhiteTurn && !engine.isWhite)) &&
                    finishedGameStatus === undefined
                        ? `(Thinking...)`
                        : ``}
                </span>
            </div>

            <div className=" w-[300px] sm:w-[650px] my-[10px]">
                <ReactChessboard
                    position={gamePosition}
                    showBoardNotation={false}
                    boardOrientation={!engine.isWhite ? `white` : `black`}
                    arePiecesDraggable={false}
                    areArrowsAllowed={false}
                    autoPromoteToQueen={false}
                    showPromotionDialog={false}
                />
            </div>

            <div className=" font-bold text-[18px]">User</div>

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

            <Toast
                ref={userMoveErrorToast}
                position="center"
            />
        </div>
    );
}
