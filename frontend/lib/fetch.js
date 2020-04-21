import fetch from 'isomorphic-unfetch'
import Cookie from 'js-cookie'

export async function fetcherWithHeader (url, cookie={}) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'credentials': "include",
    };
    if (cookie.csrftoken !== 'undefined') {
        headers['X-CSRFToken'] = cookie.csrftoken
    }
    const res = await fetch(url, {headers: headers});
    return res.json();
}

export default class Fetcher {

    constructor(
        url,
        method = 'GET',
        data = null,
        cookie = null,
        credentialsInclude = false,
        onSuccessCallback = null,
        onFailCallback = null,
        headers = null,
        successStatuses = [200, 201],
    ) {
        this.url = url;
        this.method = method;
        if(cookie){
            this.cookie = cookie;
        } else {
            this.cookie = Cookie.get();
        }
        this.successStatuses = successStatuses;
        this.onSuccessCallback = onSuccessCallback;
        this.onFailCallback = onFailCallback;
        this.results = [];

        if(headers){
            this.headers = headers;
        } else {
            this.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };
        }
        if(credentialsInclude){
            this.headers['credentials'] = "include";
        }
        if(data){
            this.data = data;
        }
    }

    start = async () => {
        if (this.cookie.csrftoken !== 'undefined') {
            this.headers['X-CSRFToken'] = this.cookie.csrftoken
        } else if(this.data['X-CSRFToken']){
            this.headers['X-CSRFToken'] = this.data['X-CSRFToken']
        }
        if(this.cookie.token !== 'undefined'){
            this.headers['Authorization'] = `Token ${this.cookie.token}`
        }

        if(this.method === 'GET'){
            return this.get();
        } else {
            return this.post();
        }
    };

    get = async () => {
        try {
            return await fetch(this.url, {headers: this.headers})
                .then(res => res.json())
                .catch(error => error)
        } catch (error) {
            (this.onFailCallback) ? this.onFailCallback(error) : null;
            return {result: false, data: error}
        }
    };

    post = async () => {
        try {
            return fetch(this.url, {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(this.data)
            })
                .then(res => res.json())
                .catch(error => error)

        } catch (error) {
            this.onFailCallback(error);
            return {result: false, data: error}
        }
    }
}