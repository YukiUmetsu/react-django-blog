import React, { useEffect, useState } from 'react'
import { confirmEmailFetch } from "../../lib/auth";
import Router, { useRouter } from 'next/router'
import {isEmpty} from "../../lib/utils";

const ConfirmEmail = (props) => {
    const [isComponentMounted, setIsComponentMounted] = useState(false);
    const [confirmRequestSent, setConfirmRequestSent] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setIsComponentMounted(true);
    }, []);

    let getConfirmToken = (urlString) => {
        if(isEmpty(urlString)){
            return false;
        }
        let regex = /^http:\/\/.*\/api\/accounts-rest\/registration\/account-confirm-email\/([a-zA-Z0-9:_-]*)\/$/g;
        let match = regex.exec(urlString);
        if(match == null) {
            return false;
        }
        return match[1];
    };

    let setURL = async () => {
        if(typeof window === 'undefined'){
            return "";
        }
        const url = router.query.url;
        const confirmToken = getConfirmToken(url);
        if(confirmRequestSent){
            Router.push('/users/login');
        }

        if(router.query.badRequest || !confirmToken){
            return "Unsuccessful because of the invalid URL."
        }
        if(confirmToken && !confirmRequestSent){
            let result = await confirmEmailFetch(confirmToken);
            setConfirmRequestSent(true);
            if(result){
                Router.push('/users/login');
            }
        }
        return "";
    };

    if(isComponentMounted){
        setURL();
    }

    return (
        <div> </div>
    );
};

export default ConfirmEmail