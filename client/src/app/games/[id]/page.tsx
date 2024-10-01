'use client';

import PgnMovesHistory from '@/app/components/PgnMovesHistory';
import { fetcherIncludingCredentials } from '@/app/utils/axios-fetchers';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Chessboard from '../../components/Chessboard';
import Loader from '@/app/components/Loader';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/store';
import { setGamePGN, setResult } from '@/app/store/againstEngineGameSlice';

export default function Page({ params }: { params: { id: string } }) {
    const dispatch = useAppDispatch();
    
    const {
        data: gameDetails,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['gameDetails'],
        queryFn: async () => {
            const { data } = (await fetcherIncludingCredentials.get(
                `/engines/games/${params.id}`,
            )) as { data: GameAgainstEngine };

            return data;
        },
    });

    useEffect(() => {
        if (gameDetails !== undefined) {
            dispatch(setGamePGN(gameDetails.PGN));

            dispatch(setResult(gameDetails.result));
        }
    }, [dispatch, gameDetails]);

    if (isLoading) {
        return <Loader isLoading={isLoading} />;
    }

    if (isError) {
        return (
            <h1 className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[18px] font-extrabold">
                {
                    (
                        (error as AxiosError).response!.data as {
                            message: string;
                        }
                    ).message
                }
            </h1>
        );
    }

    return (
        <div className=" flex flex-col sm:flex-row gap-[30px]">
            <Chessboard
                gameId={params.id}
                engine={gameDetails!.engine}
            />

            <PgnMovesHistory 
                engine={gameDetails!.engine}
                username={gameDetails!.username}
                createdAt={gameDetails!.createdAt}
            />
        </div>
    );
}
