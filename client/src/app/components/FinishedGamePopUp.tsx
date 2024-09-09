import { Dialog } from 'primereact/dialog';

type FinishedGamePopUpProps = {
    isThePopUpVisible: boolean;
    setIsThePopUpVisible: (value: boolean) => void;
    status: FinishedGameStatus | undefined;
};

export default function FinishedGamePopUp({
    status,
    isThePopUpVisible,
    setIsThePopUpVisible,
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
            <div>
                {status?.winner === undefined ? (
                    <div>The game is drawn!</div>
                ) : status.winner === 'white' ? (
                    <div>White won!</div>
                ) : (
                    <div>Black won!</div>
                )}
            </div>
        </Dialog>
    );
}
