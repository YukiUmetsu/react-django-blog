import React, { useState, useEffect } from 'react';
import ForgotPasswordForm from "../../components/Users/ForgotPasswordForm";
import Alert from "../../components/UI/Notifications/Alert";

const forgotPassword = (props) => {
    const [ wasRequestSent, setWasRequestSent ] = useState(false);

    useEffect(() => {
        renderAlert();
    });

    let renderAlert = () => {
        if(wasRequestSent){
            return (
                <div className="flex flex-col min-w-1/3 sm:w-1/3 md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/3 mx-auto mb-5">
                    <Alert
                        title="Email Sent!"
                        content="Email was sent if the email is registered."
                        closeCallback={() => setWasRequestSent(false)}
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
                <div className="container w-full max-w-sm mx-auto flex-1 flex flex-col items-center justify-center">
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-center">Forgot Password?</h1>
                        <ForgotPasswordForm onRequestSent={() => setWasRequestSent(true)}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default forgotPassword