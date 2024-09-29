'use client';

import PgnMovesHistory from '@/app/components/PgnMovesHistory';
import { fetcherIncludingCredentials } from '@/app/utils/axios-fetchers';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Chessboard from '../../components/Chessboard';

export default function Page({ params }: { params: { id: string } }) {
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

    if (isLoading) {
        return <div>Loading...</div>;
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
                engine={gameDetails!.engine}
                pgn={gameDetails!.PGN}
            />

            <PgnMovesHistory />
        </div>
    );
}
