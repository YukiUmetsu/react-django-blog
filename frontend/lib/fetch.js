import fetch from 'isomorphic-unfetch'

export default async function fetcher (...args) {
    const res = await fetch(...args);
    return res.json()
}

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