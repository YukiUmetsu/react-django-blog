import {createContext, useEffect, useState} from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import {
    USER_DETAIL_FROM_TOKEN_API
} from "../../constants";
import {isEmpty} from "../utils";
import {ADMIN_DASHBOARD_URL, ADMIN_LOGIN_URL} from "../../constants/URLs";
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

export const AdminAuthContext = createContext(null);
export const withAdminAuth = WrappedComponent => {
    const Wrapper = props => {

        let [loggedInUser, setLoggedInUser] = useState(null);

        const syncLogout = event => {
            if (event.key === 'logout') {
                console.log('logged out from storage!');
                Router.push(ADMIN_LOGIN_URL)
            }
        };

        const getLoggedInUser = async () => {
            const token = await cookie.get('token');
            const newLoggedInUser = await fetchLoggedInUser(token);
            setLoggedInUser(newLoggedInUser);
        };

        useEffect(() => {
            if(loggedInUser === null){
                getLoggedInUser();
            }
            return () => setLoggedInUser(null);
        }, []);

        useEffect(() => {
            window.addEventListener('storage', syncLogout);

            return () => {
                window.removeEventListener('storage', syncLogout);
                window.localStorage.removeItem('logout')
            }
        }, []);

        return (
            <AdminAuthContext.Provider value={{loggedInUser: loggedInUser}}>
                <WrappedComponent {...props} />
            </AdminAuthContext.Provider>
        );
    };

    Wrapper.getInitialProps = async ctx => {
        const token = await adminAuth(ctx);
        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx));

        return { ...componentProps, token}
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
            adminLogin(userData.is_staff);
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

let adminLogin = (is_staff) => {
    if(!is_staff){
        return Router.push(ADMIN_LOGIN_URL);
    }
    Router.push(ADMIN_DASHBOARD_URL) ;
};

let fetchLoggedInUser = async (token) => {
    let csrf_token = cookie.get('csrf_token');
    const headers = defaultHeader;
    if(!isEmpty(csrf_token)){
        headers['X-CSRFToken'] = csrf_token;
    }
    headers['Authorization'] = `Token ${token}`;

    try {
        const response = await fetch(USER_DETAIL_FROM_TOKEN_API, {
            headers: headers,
        });
        if (response.status === 200) {
            return await response.json();
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }

    } catch (error) {
        return error;
    }
};
