'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import NewGameAgainstEngineSettings from './components/NewGameAgainstEngineSettings';
import { AxiosError } from 'axios';
import { fetcherIncludingCredentials } from './utils/axios-fetchers';
import { useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import Loader from './components/Loader';

export default function Home() {
    const router = useRouter();

    const [engines, setEngines] = useState<Engine[]>([]);

    const [visible, setVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    async function handleNewGameSettings() {
        try {
            setIsLoading(true);

            const { data } = (await fetcherIncludingCredentials.get(
                `/engines`,
            )) as { data: Engine[] };

            setEngines(data);

            setVisible(true);
        } catch (error) {
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
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="max-w-4xl">
                <Loader isLoading={isLoading} />

                <div>
                    <Button
                        label={`New game`}
                        onClick={handleNewGameSettings}
                        className=" mb-[20px]"
                    />

                    <Dialog
                        header={`Play against the Arasan engine`}
                        visible={visible}
                        className=" w-[300px] sm:w-[400px]"
                        onHide={() => {
                            if (!visible) {
                                return;
                            }

                            setVisible(false);
                        }}
                    >
                        <NewGameAgainstEngineSettings engines={engines} />
                    </Dialog>

                    <div className=" flex flex-col sm:flex-row gap-[30px]">
                        <div className=" w-[300px] sm:w-[650px] my-[10px]">
                            <Chessboard
                                showBoardNotation={false}
                                boardOrientation={`white`}
                                arePiecesDraggable={false}
                                areArrowsAllowed={false}
                                autoPromoteToQueen={false}
                                showPromotionDialog={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
