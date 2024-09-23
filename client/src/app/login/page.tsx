'use client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Password } from 'primereact/password';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcherIncludingCredentials } from '../utils/axios-fetchers';
import { AxiosError } from 'axios';
import { useAppDispatch } from '../store';
import { setUserCredentials } from '../store/userSlice';
import Link from 'next/link';

export default function Page() {
    const router = useRouter();

    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const dispatch = useAppDispatch();

    async function handleLogin(e?: FormEvent) {
        if (e !== undefined) {
            e.preventDefault();
        }

        try {
            const { data } = (await fetcherIncludingCredentials.post(
                `/users/login`,
                {
                    usernameOrEmail,
                    password,
                },
            )) as { data: UserCredentials };

            dispatch(setUserCredentials(data));

            router.push(`/`);
        } catch (error) {
            const axiosError = (error as AxiosError).response
                ?.data as ErrorDetails;

            setErrorMsg(axiosError.message);
        } finally {
        }
    }

    useEffect(() => {
        setErrorMsg('');
    }, [usernameOrEmail, password]);

    return (
        <>
            <Card
                title={`Log into your account`}
                subTitle={`Sign in`}
                className=" w-[310px] sm:w-[500px] pt-[10px]"
                header={
                    <div className=" flex justify-center items-center">
                        <h1>Shakhmat</h1>
                    </div>
                }
                footer={
                    <div className=" flex items-center justify-end gap-[20px]">
                        <Link
                            href={`/sign-up`}
                            className=" underline text-blue-700"
                        >
                            Don&apos;t have an account yet? Sign up
                        </Link>

                        <Button
                            type="submit"
                            onClick={handleLogin}
                        >
                            Log in
                        </Button>
                    </div>
                }
            >
                <form
                    className="flex flex-col gap-[20px] w-full p-[10px]"
                    onSubmit={handleLogin}
                >
                    <FloatLabel>
                        <InputText
                            id="username-or-email"
                            className=" w-full"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />

                        <label htmlFor="username-or-email">Username</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Password
                            inputId="password"
                            toggleMask
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label htmlFor="password">Password</label>
                    </FloatLabel>

                    <Button
                        type="submit"
                        className=" hidden"
                    ></Button>
                </form>

                <p className=" text-[red]">{errorMsg}</p>
            </Card>
        </>
    );
}
