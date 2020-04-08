import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import {LOGIN_API} from "../constants";

const loginURL = '/users/login';

export const login = ({ token }) => {
    cookie.set('token', token, { expires: 1 });
    Router.push('/users/dashboard')
};

export const auth = ctx => {
    const { token } = nextCookie(ctx);

    // If there's no token, it means the user is not logged in.
    if (!token) {
        if (typeof window === 'undefined') {
            ctx.res.writeHead(302, { Location: loginURL });
            ctx.res.end()
        } else {
            Router.push(loginURL)
        }
    }

    return token
};

export const logout = () => {
    cookie.remove('token');
    // to support logging out from all windows

    window.localStorage.setItem('logout', Date.now());
    Router.push(loginURL)
};

export const withAuthSync = WrappedComponent => {
    const Wrapper = props => {
        const syncLogout = event => {
            if (event.key === 'logout') {
                console.log('logged out from storage!');
                Router.push(loginURL)
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

export const loginFetch = async (data) => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
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
            const { token } = await response.json();
            await login({ token })
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error
        }

    } catch (error) {
        return error;
    }
};