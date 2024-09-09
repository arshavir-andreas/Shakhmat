'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import NewGameAgainstEngineSettings from './components/NewGameAgainstEngineSettings';
import Chessboard from './components/Chessboard';
import { RootState, useAppSelector } from './store';

export default function Home() {
    const [visible, setVisible] = useState(false);

    const isTheGameReady = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.isTheGameReady,
    );

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-4xl">
                <div>
                    <Button
                        label={`New game`}
                        onClick={() => setVisible(true)}
                        className=" mb-[20px]"
                    />

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

                    <Chessboard />
                </div>
            </div>
        </div>
    );
}
