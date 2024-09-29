'use client';

import React, { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function ReactQueryClientProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = useRef(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    refetchOnMount: true,
                    retry: false,
                    retryOnMount: false,
                    networkMode: 'always',
                },
            },
        }),
    );

    return (
        <QueryClientProvider client={queryClient.current}>
            {children}
        </QueryClientProvider>
    );
}
