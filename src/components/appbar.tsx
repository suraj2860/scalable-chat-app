"use client";

import { useRouter } from 'next/navigation';
import { Button } from "./button";
import { DarkModeToggle } from "./darkModeToggle";
import { SignInResponse, SignOutResponse } from 'next-auth/react';

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    onSignin: (provider: string, options: { callbackUrl: string; redirect: boolean }) => Promise<SignInResponse | undefined>,
    onSignout: (options: { redirect: boolean }) => Promise<SignOutResponse | undefined>,
}

export const Appbar = ({
    user,
    onSignin,
    onSignout,
}: AppbarProps) => {
    const router = useRouter();

    const handleAuthAction = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (user) {
            router.push('/sign-in');
            await onSignout({ redirect: false });
        } else {
            await onSignin('email', { callbackUrl: "/", redirect: false });
        }
    };

    return (
        <div className="flex justify-between border-b border-black dark:border-white px-4 items-center">
            <div className="text-2xl ml-32 flex flex-col justify-center">
                Chat-App
            </div>
            <div className="flex justify-center pt-2 mr-12 ">
                <DarkModeToggle />
                <Button onClick={handleAuthAction}>
                    {user ? "Logout" : "Login"}
                </Button>
            </div>
        </div>
    );
}