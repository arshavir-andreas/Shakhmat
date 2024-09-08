import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-green/theme.css';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});

const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Shakhmat',
    description: 'A new pedagogical way to improve chess skills',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <main>
                    <PrimeReactProvider>{children}</PrimeReactProvider>
                </main>
            </body>
        </html>
    );
}
