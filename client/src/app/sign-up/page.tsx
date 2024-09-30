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
import Link from 'next/link';
import Loader from '../components/Loader';

export default function Page() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRetyped, setNewPasswordRetyped] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    async function handleAccountCreation(e?: FormEvent) {
        if (e !== undefined) {
            e.preventDefault();
        }

        if (newPassword !== newPasswordRetyped) {
            setErrorMsg(`The passwords are not equal!`);

            return;
        }

        try {
            setIsLoading(true);

            await fetcherIncludingCredentials.post(`/users`, {
                username,
                email,
                password: newPassword,
            });

            router.push(`/`);
        } catch (error) {
            const axiosError = (error as AxiosError).response
                ?.data as ErrorDetails;

            setErrorMsg(axiosError.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setErrorMsg('');
    }, [username, email, newPassword, newPasswordRetyped]);

    return (
        <>
            <Loader isLoading={isLoading} />
            
            <Card
                title={`Create your account`}
                subTitle={`Sign up`}
                className=" w-[310px] sm:w-[500px] pt-[10px]"
                header={
                    <div className=" flex justify-center items-center">
                        <h1>Shakhmat</h1>
                    </div>
                }
                footer={
                    <div className=" flex items-center justify-end gap-[20px]">
                        <Link
                            href={`/login`}
                            className=" underline text-blue-700"
                        >
                            Already have an account? Sign in
                        </Link>

                        <Button
                            type="submit"
                            onClick={handleAccountCreation}
                        >
                            Sign up
                        </Button>
                    </div>
                }
            >
                <form
                    className="flex flex-col gap-[20px] w-full p-[10px]"
                    onSubmit={handleAccountCreation}
                >
                    <FloatLabel>
                        <InputText
                            id="username"
                            className=" w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label htmlFor="username">Username</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText
                            id="email"
                            type="email"
                            className=" w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="email">Email</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Password
                            inputId="new-password"
                            toggleMask
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <label htmlFor="new-password">New password</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Password
                            inputId="new-password-retyped"
                            toggleMask
                            value={newPasswordRetyped}
                            onChange={(e) =>
                                setNewPasswordRetyped(e.target.value)
                            }
                        />

                        <label htmlFor="new-password-retyped">
                            Retype the new password
                        </label>
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
