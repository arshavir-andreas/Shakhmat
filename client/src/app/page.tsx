'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import NewGameAgainstEngineSettings from './components/NewGameAgainstEngineSettings';
import Chessboard from './components/Chessboard';
import { RootState, useAppDispatch, useAppSelector } from './store';
import PgnMovesHistory from './components/PgnMovesHistory';
import { AxiosError } from 'axios';
import { fetcherIncludingCredentials } from './utils/axios-fetchers';
import { setUserCredentials } from './store/userSlice';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    const [visible, setVisible] = useState(false);

    const isTheGameReady = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.isTheGameReady,
    );

    const dispatch = useAppDispatch();

    async function handleNewGameSettings() {
        try {
            const { data } = (await fetcherIncludingCredentials.get(
                `/user-credentials`,
            )) as { data: UserCredentials };

            dispatch(setUserCredentials(data));

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
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="max-w-4xl">
                <div>
                    {!isTheGameReady ? (
                        <Button
                            label={`New game`}
                            onClick={handleNewGameSettings}
                            className=" mb-[20px]"
                        />
                    ) : (
                        <></>
                    )}

                    <Dialog
                        header={`Play against the Arasan engine`}
                        visible={visible && !isTheGameReady}
                        className=" w-[400px]"
                        onHide={() => {
                            if (!visible) {
                                return;
                            }

                            setVisible(false);
                        }}
                    >
                        <NewGameAgainstEngineSettings />
                    </Dialog>

                    <div className=" flex flex-col sm:flex-row gap-[30px]">
                        <Chessboard />

                        <PgnMovesHistory />
                    </div>
                </div>
            </div>
        </div>
    );
}
