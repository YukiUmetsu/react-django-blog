import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import {
    CONFIRM_TOKEN_API, IS_STAFF_COOKIE_NAME, IS_SUPERUSER_COOKIE_NAME,
    LOGIN_API,
    LOGOUT_API,
    PASSWORD_RESET_API,
    PASSWORD_RESET_CONFIRM_API,
    SIGN_UP_API, USER_DETAIL_FROM_TOKEN_API
} from "../constants";
import {isEmpty} from "./utils";
import {ADMIN_DASHBOARD_URL, ADMIN_LOGIN_URL, LOGIN_URL} from "../constants/URLs";

const defaultHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const login = ({ token }) => {
    cookie.set('token', token, { expires: 1 });
    Router.push('/users/dashboard')
};

export const auth = ctx => {
    const { token } = nextCookie(ctx);

    // If there's no token, it means the user is not logged in.
    if (!token) {
        if (typeof window === 'undefined') {
            ctx.res.writeHead(302, { Location: LOGIN_URL });
            ctx.res.end()
        } else {
            Router.push(LOGIN_URL)
        }
    }

    return token
};

export const logout = async () => {
    const headers = defaultHeader;
    const token = cookie.get('token');
    const csrf_token = cookie.get('csrf_token');
    if (csrf_token!== 'undefined') {
        headers['X-CSRFToken'] = csrf_token
    }
    const response = await fetch(LOGOUT_API, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({token: token}),
    });

    cookie.remove('token');
    // to support logging out from all windows
    window.localStorage.setItem('logout', Date.now());

    let is_staff = cookie.get(IS_STAFF_COOKIE_NAME);
    if(is_staff){
        cookie.remove(IS_STAFF_COOKIE_NAME);
        cookie.remove(IS_SUPERUSER_COOKIE_NAME);
        return Router.push(ADMIN_LOGIN_URL);
    }
    Router.push(LOGIN_URL)
};

export const withAuthSync = WrappedComponent => {
    const Wrapper = props => {
        const syncLogout = event => {
            if (event.key === 'logout') {
                console.log('logged out from storage!');
                Router.push(LOGIN_URL)
            }
        };

        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            return () => {
                window.removeEventListener('storage', syncLogout);
                window.localStorage.removeItem('logout')
            }
        }, []);

        return <WrappedComponent {...props} />
    };

    Wrapper.getInitialProps = async ctx => {
        const token = auth(ctx);

        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx));

        return { ...componentProps, token }
    };

    return Wrapper
};

export const loginFetch = async (data, noTransfer = false) => {
    const headers = defaultHeader;
    if (data['csrf_token'] !== 'undefined') {
        headers['X-CSRFToken'] = data['csrf_token']
    }

    try {
        const response = await fetch(LOGIN_API, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });
        if (response.status === 200) {
            const responseData = await response.json();
            const token = responseData.key;
            if(!noTransfer){
                await login({ token });
            }
            return {token: token, response: response};
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }

    } catch (error) {
        return error;
    }
};

export const AdminLoginFetch = async data => {
    let loginRespond = await loginFetch(data, true);
    let wasLoginSuccess = !isEmpty(loginRespond.token);
    if(!wasLoginSuccess){
        return error;
    }
    cookie.set('token', loginRespond.token, { expires: 1 });
    let csrf_token = cookie.get('csrf_token');
    const headers = defaultHeader;
    if (data['csrf_token'] !== 'undefined') {
        headers['X-CSRFToken'] = data['csrf_token']
    } else if(!isEmpty(csrf_token)){
        headers['X-CSRFToken'] = csrf_token;
    }
    headers['Authorization'] = `Token ${loginRespond.token}`;

    try {
        const response = await fetch(USER_DETAIL_FROM_TOKEN_API, {
            headers: headers,
        });
        if (response.status === 200) {
            const userData = await response.json();
            adminLogin(userData.is_staff, userData.is_superuser);
            return {userData: userData, response: response};
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }

    } catch (error) {
        return error;
    }
};

let adminLogin = (is_staff, is_superuser) => {
    if(!is_staff){
        return Router.push(ADMIN_LOGIN_URL);
    }
    cookie.set(IS_STAFF_COOKIE_NAME, true, { expires: 1 });
    if(is_superuser){
        cookie.set(IS_SUPERUSER_COOKIE_NAME, true, { expires: 1 });
    }
    Router.push(ADMIN_DASHBOARD_URL) ;
};


let includeConfirmedCookie = (cookie) => {
    if(typeof cookie === 'undefined'){
        return false;
    }
    if(cookie.includes("have confirmed")){
        return true;
    }
    return false;
};

export const signUpFetch = async (data) => {
    const headers = defaultHeader;
    if (!isEmpty(data['csrf_token'])) {
        headers['X-CSRFToken'] = data['csrf_token']
    }

    try {
        const response = await fetch(SIGN_UP_API, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });
        if (response.status === 201) {
            return true;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }

    } catch (error) {
        console.log(error);
        return error;
    }
};

export const confirmEmailFetch = async (confirmToken) => {
    let alreadyConfirmed = !isEmpty(cookie.get("confirm-email-successful"));
    let confirmURL = CONFIRM_TOKEN_API + confirmToken + "/";
    const headers = defaultHeader;
    const csrf_token = cookie.get('csrf_token');
    if (csrf_token!== 'undefined') {
        headers['X-CSRFToken'] = csrf_token
    }
    if(alreadyConfirmed){
        return true;
    }
    const response = await fetch(confirmURL, {headers: headers});

    if([302,200].includes(response.status) || includeConfirmedCookie(cookie.get("messages"))){
        cookie.set("confirm-email-successful", true);
        //Router.push('/users/login');
        return true;
    } else {
        Router.push('/users/confirm-email?badRequest=true');
    }
};

export const resetPasswordFetch = async (data) => {
    const headers = defaultHeader;
    if (!isEmpty(data['csrf_token'])) {
        headers['X-CSRFToken'] = data['csrf_token']
    }
    let email = data['email'];

    try {
        const response = await fetch(PASSWORD_RESET_API, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({'email': email}),
        });
        if (response.status === 200) {
            return true;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }

    } catch (error) {
        console.log(error);
        return error;
    }
};

export const resetPasswordConfirmFetch = async (data) => {
    const headers = defaultHeader;
    if (!isEmpty(data['csrf_token'])) {
        headers['X-CSRFToken'] = data['csrf_token']
    }

    try {
        const response = await fetch(PASSWORD_RESET_CONFIRM_API, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });
        if (response.status === 200) {
            return true;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }

    } catch (error) {
        return error;
    }
};
