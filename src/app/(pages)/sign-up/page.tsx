"use client";
import Link from 'next/link';
import React from 'react';
// import { Button } from '@repo/ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../../../../schema/signup.schema'; // Adjust the import path as needed
import { z } from 'zod';
import { EmptyAppbar } from '../../../components/emptyAppbar';

type FormValues = z.infer<typeof signUpSchema>;

export default function SignIn() {
    const { control, handleSubmit, setError, clearErrors, formState: { errors }, watch } = useForm<FormValues>({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur'
    });
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleSignUp = async (data: FormValues) => {
        setLoading(true);

        try {
            const response = await axios.post('/api/sign-up', data);
            // console.log(response);

            if (response.status === 200) {
                toast.success(response.data.message);
                router.push("/sign-in");
            } else {
                response.data.errors.forEach((error: string) => {
                    toast.error(error);
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                error.response?.data.errors.forEach((error: string) => {
                    toast.error(error);
                });
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFocus = (field: keyof FormValues) => {
        const value = watch(field);
        if (value) {
            const result = signUpSchema.shape[field].safeParse(value);


            if (!result.success) {
                const error = JSON.parse(result.error?.message || '')
                console.log(error);
                setError(field, { type: 'manual', message: error[0].message });
            } else {
                clearErrors(field);
            }
        }
    };

    return (
        <div>
            {/* <div className="text-2xl p-4 ml-32 flex flex-col justify-center text-white">
                eSportsConnect
            </div> */}
            <EmptyAppbar />
            <div className='flex flex-col mx-auto mt-20 w-96 border-2 rounded-md p-6 text-sm text-gray-700 bg-white'>
                <h1 className='text-3xl mb-4 text-black'>Join Chat-App</h1>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <div className="relative mt-4">
                                <input
                                    type="text"
                                    id="floating_outlined_username"
                                    className={`block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.username ? 'border-red-500' : 'border-black'} appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
                                    placeholder=" "
                                    {...field}
                                    onBlur={() => handleFocus('username')}
                                />
                                <label htmlFor="floating_outlined_username" className="absolute text-sm text-gray-500 hover:cursor-text duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-5 peer-focus:top-1.5 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                                    Username*
                                </label>
                                {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
                            </div>
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <div className="relative mt-4">
                                <input
                                    type="email"
                                    id="floating_outlined_email"
                                    className={`block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.email ? 'border-red-500' : 'border-black'} appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
                                    placeholder=" "
                                    {...field}
                                    onBlur={() => handleFocus('email')}
                                />
                                <label htmlFor="floating_outlined_email" className="absolute text-sm text-gray-500 hover:cursor-text duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-5 peer-focus:top-1.5 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                                    Email*
                                </label>
                                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                            </div>
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <div className="relative mt-4">
                                <input
                                    type="password"
                                    id="floating_outlined_password"
                                    className={`block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${errors.password ? 'border-red-500' : 'border-black'} appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
                                    placeholder=" "
                                    {...field}
                                    onBlur={() => handleFocus('password')}
                                />
                                <label htmlFor="floating_outlined_password" className="absolute text-sm text-gray-500 hover:cursor-text duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-5 peer-focus:top-1.5 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                                    Password* (8+ characters)
                                </label>
                                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                            </div>
                        )}
                    />
                    <p className='mt-4 my-4 text-xs'>
                        By clicking Agree & Join, you agree to the LinkedIn
                        <Link href={'/'} className='text-blue-600 hover:underline'> User Agreement</Link>,
                        <Link href={'/'} className='text-blue-600 hover:underline'> Privacy Policy</Link>,
                        and <Link href={'/'} className='text-blue-600 hover:underline'> Cookie Policy</Link>.
                    </p>
                    <button disabled={loading} type="submit" className="text-white w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2">
                        Agree & Join
                    </button>
                </form>
                <h4>------------------------------------ or --------------------------------------</h4>
                <button
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="flex items-center mb-4 justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 mt-4 text-sm font-medium text-gray-800  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1">
                        <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" fill="#FBBC05"></path>
                        <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" fill="#EB4335"></path>
                        <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" fill="#34A853"></path>
                        <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" fill="#4285F4"></path>
                    </svg>
                    <span>Continue with Google</span>
                </button>
                <h2 className='flex justify-center text-base'>Already on Chat-App? <Link href={'/sign-in'} className='text-blue-600 ml-2'> Sign in</Link></h2>
            </div>
        </div>
    );
}
