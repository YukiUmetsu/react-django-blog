import React, { useState, useEffect } from 'react';
import LoginForm from "../../components/Users/LoginForm";
import Link from "next/link";
import Alert from "../../components/UI/Notifications/Alert";
import { useRouter } from 'next/router'
import PackmanSpinner from "../../components/UI/Spinner/PackmanSpinner";

const Login = (props) => {
    const router = useRouter()
    const [ hasServerError, setHasServerError ] = useState(false);
    const [ overMaxLoginFailure, setOverMaxLoginFailure ] = useState(false);
    const [ createdSuccess, setCreatedSuccess ] = useState(false);
    const [ showedCreatedSuccess, setShowedCreatedSuccess ] = useState(false);

    useEffect(() => {
        let createParam = router.query.create;
        if(createParam === 'success'){
            setCreatedSuccess(true)
        } else {
            setShowedCreatedSuccess(false)
        }
        renderAlert();
    });

    let renderAlert = () => {
        if(overMaxLoginFailure){
            return (
                <div className="flex flex-col min-w-1/3 sm:w-1/3 md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/3 mx-auto mb-5">
                <Alert
                    title="Oh NO!"
                    content="You reached today's login tries! Comeback tomorrow!"
                    closeCallback={() => ""}
                />
                </div>
            );
        }
        if(hasServerError){
            return (
                <div className="flex flex-col min-w-1/3 sm:w-1/3 md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/3 mx-auto mb-5">
                    <Alert
                        title="Oops!"
                        content="Email, Password or both are not correct!"
                        closeCallback={() => setHasServerError(false)}
                    />
                </div>
                );
        }
        if(createdSuccess && !showedCreatedSuccess){
            setTimeout(() => setShowedCreatedSuccess(true), 3000);
            return (
                <div className="flex flex-col min-w-1/3 sm:w-1/3 md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/3 mx-auto mb-5">
                <Alert
                    bgColor="teal"
                    textColor="teal"
                    exitColor="green"
                    title="Your account was created! "
                    content="Please check your email and login."
                    closeCallback={() => setCreatedSuccess(false)}
                />
                </div>
            );
        }
        return "";
    };

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center" style={{background: '#edf2f7'}}>
            <div className="bg-grey-lighter min-h-screen flex flex-col min-w-full sm:w-full md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/3">
                { renderAlert() }
                <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-center">Login</h1>
                        { props.isPageLoading ?
                            <PackmanSpinner/>:
                            <LoginForm
                                onServerError={() => setHasServerError(true)}
                                maxLoginFailure={10}
                                onMaxLoginFailureCallback={() => setOverMaxLoginFailure(true)}
                            />
                        }
                    </div>

                    <div className="text-grey-dark mt-6">
                        <Link href="/users/forgot-password">
                            <a className="text-blue-600">Forgot password?</a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login