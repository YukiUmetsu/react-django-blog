import React, {useEffect, useState} from 'react';
import Alert from "../../components/UI/Notifications/Alert";
import ResetPasswordForm from "../../components/Users/ResetPasswordForm";

const ResetPassword = (props) => {
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
            <div className="bg-grey-lighter min-h-screen flex flex-col min-w-full sm:w-full md:min-w-1/2 lg:min-w-1/3 xl:min-w-1/3">
                { renderAlert() }
                <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-center">Reset Password</h1>
                        <ResetPasswordForm onServerError={() => setHasServerError(true)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword