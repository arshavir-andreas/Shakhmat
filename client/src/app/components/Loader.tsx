import { RiseLoader } from 'react-spinners';

type LoaderProps = {
    isLoading: boolean;
};

export default function Loader({ isLoading }: LoaderProps) {
    return (
        <div className={isLoading ? ` fixed top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.3)] z-[9999] flex items-center justify-center` : ``}>
            <RiseLoader
                color="#059669"
                loading={isLoading}
            />
        </div>
    );
}
