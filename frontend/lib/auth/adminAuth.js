import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import {
    ANGO_SESSION_NAME, IS_STAFF_SESSION_NAME, IS_SUPERUSER_SESSION_NAME,
    USER_DETAIL_FROM_TOKEN_API, USER_ID_SESSION_NAME
} from "../../constants";
import {isEmpty} from "../utils";
import {ADMIN_DASHBOARD_URL, ADMIN_LOGIN_URL, LOGIN_URL} from "../../constants/URLs";
import {code} from "../crypto";
import {loginFetch} from "./auth";

const defaultHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const adminAuth = ctx => {
    const { token } = nextCookie(ctx);

    // If there's no token, it means the user is not logged in.
    if (!token) {
        if (typeof window === 'undefined') {
            ctx.res.writeHead(302, { Location: ADMIN_LOGIN_URL });
            ctx.res.end()
        } else {
            Router.push(ADMIN_LOGIN_URL)
        }
    }

    return token
};

export const withAdminAuth = WrappedComponent => {
    const Wrapper = props => {
        const syncLogout = event => {
            if (event.key === 'logout') {
                console.log('logged out from storage!');
                Router.push(ADMIN_LOGIN_URL)
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
        const token = adminAuth(ctx);

        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx));

        return { ...componentProps, token }
    };

    return Wrapper
};

export const AdminLoginFetch = async (data, angoKey) => {
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
            adminLogin(userData.is_staff, userData.is_superuser, angoKey, userData);
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

let adminLogin = (is_staff, is_superuser, angoKey, userData) => {
    if(!is_staff){
        return Router.push(ADMIN_LOGIN_URL);
    }
    sessionStorage.setItem(ANGO_SESSION_NAME, angoKey);
    sessionStorage.setItem(USER_ID_SESSION_NAME, code(`${userData.id}`, angoKey));
    sessionStorage.setItem(IS_STAFF_SESSION_NAME, '1');
    if(is_superuser){
        sessionStorage.setItem(IS_SUPERUSER_SESSION_NAME, '1');
    }
    Router.push(ADMIN_DASHBOARD_URL) ;
};


