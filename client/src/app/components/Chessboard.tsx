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
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { setGamePGN, setResult } from '../store/againstEngineGameSlice';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

type ChessboardProps = {
    gameId: string;
    engine: EngineDetails;
    pgn: string;
};

export default function Chessboard({ gameId, engine, pgn }: ChessboardProps) {
    const router = useRouter();

    const dispatch = useAppDispatch();

    const result = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.result,
    );

    const [isWhiteTurn, setIsWhiteTurn] = useState(true);

    const game = useMemo(() => {
        const newGame = new Chess();

        newGame.loadPgn(pgn);

        return newGame;
    }, [pgn]);

    const [gamePosition, setGamePosition] = useState(game.fen());

    const [userMove, setUserMove] = useState('');

    const userMoveInputRef = useRef<HTMLInputElement>(null);

    const [isFinishedGamePopUpVisible, setIsFinishedGamePopUpVisible] =
        useState(false);

    const isUserMoveInputDisabled = useMemo(() => {
        return (
            (!engine.isWhite && !isWhiteTurn) ||
            (engine.isWhite && isWhiteTurn) ||
            result !== '*'
        );
    }, [result, engine.isWhite, isWhiteTurn]);

    const userMoveErrorToast = useRef<Toast>(null!);

    const checkGameStatus = useCallback(() => {
        if (game.isCheckmate()) {
            if (isWhiteTurn) {
                dispatch(setResult('1-0'));
            } else {
                dispatch(setResult('0-1'));
            }

            setIsFinishedGamePopUpVisible(true);
        }

        if (game.isDraw()) {
            dispatch(setResult('1/2-1/2'));

            setIsFinishedGamePopUpVisible(true);
        }
    }, [dispatch, game, isWhiteTurn]);

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

    function resignCurrentGame() {
        if (engine.isWhite) {
            dispatch(setResult('1-0'));

            setIsFinishedGamePopUpVisible(true);
        } else{
            dispatch(setResult('0-1'));
        }
    }

    function showResignationConfirmPopUp(target: HTMLButtonElement) {
        confirmPopup({
            tagKey: 'resignation_confirm_pop-up',
            target,
            message: (
                <div className="flex align-items-center gap-[10px] w-[200px] sm:w-full border-bottom-1 surface-border">
                    <i className="pi pi-exclamation-circle text-[30px] text-[red]"></i>

                    <span className=" text-[14px] sm:text-[16px]">
                        Are you sure you want to resign?
                    </span>
                </div>
            ),
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            acceptClassName: 'p-button-sm',
            rejectClassName: 'p-button-outlined p-button-sm',
            accept: () => resignCurrentGame(),
            reject: () => {},
        });
    }

    useEffect(() => {
        setGamePosition(game.fen());
    }, [game]);

    useEffect(() => {
        async function engineGame() {
            if (result !== '*') {
                return;
            }

            if (isWhiteTurn && engine.isWhite) {
                await getEngineBestMove();

                if (result === '*') {
                    setIsWhiteTurn(false);
                }
            } else if (!isWhiteTurn && !engine.isWhite) {
                await getEngineBestMove();

                if (result === '*') {
                    setIsWhiteTurn(true);
                }
            }
        }

        engineGame();
    }, [engine, getEngineBestMove, isWhiteTurn, result]);

    useEffect(() => {
        async function updateGameDetails() {
            try {
                await fetcherIncludingCredentials.patch(`/engines/games/${gameId}`, {
                    pgn: game.pgn(),
                    result,
                });
            } catch (error) {
                console.log(error);
            } finally {
            }
        }

        if (result !== '*') {
            updateGameDetails();
        }
    }, [game, gameId, result]);

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
                router={router}
            />

            <ConfirmPopup tagKey="resignation_confirm_pop-up" />

            <div className=" ml-[10px] mr-[10px] flex items-center justify-between">
                <span className=" font-bold text-[18px]">
                    {engine.name} {`(${engine.ELO} ELO)`}{' '}
                    {((isWhiteTurn && engine.isWhite) ||
                        (!isWhiteTurn && !engine.isWhite)) &&
                    result === '*'
                        ? `(Thinking...)`
                        : ``}
                </span>

                {result === '*' ? (
                    <Button
                        severity="danger"
                        onClick={(e) =>
                            showResignationConfirmPopUp(e.currentTarget)
                        }
                    >
                        Resign
                    </Button>
                ) : (
                    <></>
                )}
            </div>

            <div className=" w-[300px] sm:w-[650px] m-[10px]">
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

            <div className=" font-bold text-[18px] ml-[10px]">You</div>

            <form
                onSubmit={handleUserMove}
                className=" flex items-center ml-[10px]"
            >
                <label
                    htmlFor="user-move"
                    className=" mr-[1px] sm:mr-[10px] font-bold text-[12px] sm:text-[14px]"
                >
                    Your move:
                </label>

                <InputText
                    id="user-move"
                    ref={userMoveInputRef}
                    value={userMove}
                    onChange={(e) => setUserMove(e.target.value)}
                    disabled={isUserMoveInputDisabled}
                    className="w-[180px] sm:w-[400px]"
                />

                <Button
                    type="submit"
                    icon="pi pi-check"
                    className=" ml-[5px]"
                    disabled={isUserMoveInputDisabled}
                    raised
                />
            </form>

            <Toast
                ref={userMoveErrorToast}
                position="center"
            />
        </div>
    );
}
