"use client";
import Link from 'next/link';
import React, { BaseSyntheticEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { signIn } from 'next-auth/react';
import { loginSchema } from '@repo/common/loginSchema';
import toast from 'react-hot-toast';
import { EmptyAppbar } from '@repo/ui/emptyAppbar';

type SignInFormValues = z.infer<typeof loginSchema>;

export default function SignIn() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const handleSignIn = async (data: SignInFormValues, e?: BaseSyntheticEvent) => {
        e?.preventDefault();
        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                callbackUrl: '/',
                redirect: false, 
            });

            if (result?.error) {
                if (result.status === 401) {
                    toast.error("Invalid credentials");
                }
            } else {
                toast.success("Signed in successfully!");
                window.location.href = result?.url || '/';
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className=''>
            {/* <div className="text-2xl p-4 ml-32 flex flex-col justify-center text-white">
                eSportsConnect
            </div> */}
            <EmptyAppbar />
            <form onSubmit={handleSubmit((data, e) => handleSignIn(data, e))} className='flex flex-col mx-auto mt-12 w-96 border-2 bg-white rounded-md p-6 text-sm text-gray-700'>
                <h1 className='text-3xl mb-4 text-black'>Sign in</h1>
                <div className="relative mt-4">
                    <input
                        type="email"
                        id="floating_outlined_email"
                        className={`block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.email ? 'border-red-500' : 'border-black'} appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
                        placeholder=" "
                        {...register('email')}
                    />
                    <label htmlFor="floating_outlined_email" className="absolute text-sm text-gray-500 hover:cursor-text duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-5 peer-focus:top-1.5 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                        Email
                    </label>
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>
                <div className="relative mt-4">
                    <input
                        type="password"
                        id="floating_outlined_password"
                        className={`block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.password ? 'border-red-500' : 'border-black'} appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
                        placeholder=" "
                        {...register('password')}
                    />
                    <label htmlFor="floating_outlined_password" className="absolute text-sm text-gray-500 hover:cursor-text duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-5 peer-focus:top-1.5 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                        Password
                    </label>
                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                </div>
                <Link href={'/password-reset'} className='text-blue-600 my-4 w-24' >Forgot password?</Link>
                <button type="submit" className="text-white w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2">
                    Sign in
                </button>                <h4>------------------------------------ or --------------------------------------</h4>
                <button
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="flex items-center mb-4 justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 mt-4 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"><defs></defs><g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="Color-" transform="translate(-401.000000, -860.000000)"><g id="Google" transform="translate(401.000000, 860.000000)"><path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"></path><path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"></path><path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"></path><path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"></path></g></g></g></svg>
                    <span>Continue with Google</span>
                </button>
                <h2 className='flex justify-center text-base'>New to eSportsConnect? <Link href={'/sign-up'} className='text-blue-600 ml-2'> Join now</Link></h2>
            </form>
        </div>
    );
}
