import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { RootState, useAppSelector } from '../store';

type FinishedGamePopUpProps = {
    isThePopUpVisible: boolean;
    setIsThePopUpVisible: (value: boolean) => void;
    router: AppRouterInstance;
};

export default function FinishedGamePopUp({
    isThePopUpVisible,
    setIsThePopUpVisible,
    router,
}: FinishedGamePopUpProps) {
    const result = useAppSelector(
        (state: RootState) => state.againstEngineGameSlice.result,
    );
    
    return (
        <Dialog
            header={`Game completed!`}
            visible={isThePopUpVisible && status !== undefined}
            className=" w-[300px]"
            onHide={() => {
                if (!isThePopUpVisible) {
                    return;
                }

                setIsThePopUpVisible(false);
            }}
        >
            <div className=" grid gap-[20px]">
                <div>
                    {result === '1/2-1/2' ? (
                        <div>The game is drawn!</div>
                    ) : result === '1-0' ? (
                        <div>White won!</div>
                    ) : (
                        <div>Black won!</div>
                    )}
                </div>

                <Button onClick={() => router.push(`/`)}>
                    Go to home page
                </Button>
            </div>
        </Dialog>
    );
}
