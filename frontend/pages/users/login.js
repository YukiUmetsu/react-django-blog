import React from 'react';
import LoginForm from "../../components/Users/LoginForm";
import Link from "next/link";

const Login = (props) => {
    return (
        <div className="h-screen overflow-hidden flex items-center justify-center" style={{background: '#edf2f7'}}>
            <div className="bg-grey-lighter min-h-screen flex flex-col min-w-full sm:w-full md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/3">
                <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-center">Login</h1>
                        <LoginForm/>
                    </div>

                    <div className="text-grey-dark mt-6">
                        <Link href="/">
                            <a className="text-blue-600">Forgot password?</a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login