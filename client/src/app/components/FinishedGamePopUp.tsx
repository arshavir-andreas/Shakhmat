import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

type FinishedGamePopUpProps = {
    isThePopUpVisible: boolean;
    setIsThePopUpVisible: (value: boolean) => void;
    status: FinishedGameStatus | undefined;
    router: AppRouterInstance;
};

export default function FinishedGamePopUp({
    status,
    isThePopUpVisible,
    setIsThePopUpVisible,
    router,
}: FinishedGamePopUpProps) {
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
                    {status?.winner === undefined ? (
                        <div>The game is drawn!</div>
                    ) : status.winner === 'white' ? (
                        <div>White won!</div>
                    ) : (
                        <div>Black won!</div>
                    )}
                </div>

                <Button onClick={() => router.push(`/`)}>Go to home page</Button>
            </div>
        </Dialog>
    );
}
