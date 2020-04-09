import React, {useEffect, useState} from 'react';
import SignUpForm from "../../components/Users/SignUpForm";
import Link from "next/link";
import Alert from "../../components/UI/Notifications/Alert";

const Signup = (props) => {

    const [ hasServerError, setHasServerError ] = useState(false);
    useEffect(() => {
        renderAlert();
    });

    let renderAlert = () => {
        if(hasServerError){
            return (
                <div className="flex flex-col min-w-1/3 sm:w-1/3 md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/3 mx-auto mb-5">
                    <Alert
                        title="Something went wrong!"
                        content="Please make sure that everything is correct."
                        closeCallback={() => setHasServerError(false)}
                    />
                </div>
            );
        }
        return "";
    };
    return (
        <div className="h-screen overflow-hidden flex items-center justify-center" style={{background: '#edf2f7'}}>
            <div className="bg-grey-lighter min-h-screen flex flex-col">
                { renderAlert() }
                <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                        <SignUpForm onServerError={() => setHasServerError(true)} />

                        <div className="text-center text-sm text-grey-dark mt-4">
                            By signing up, you agree to the
                            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#"> Terms of Service</a> and
                            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#"> Privacy Policy</a>
                        </div>
                    </div>

                    <div className="text-grey-dark mt-6">
                        Already have an account?
                        <Link href="/users/login">
                            <a className="text-blue-600"> Log in</a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup