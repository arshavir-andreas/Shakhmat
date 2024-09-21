import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="max-w-4xl">{children}</div>
        </div>
    );
}
