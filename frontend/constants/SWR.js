import Fetcher from "../lib/fetch";

export const SWR_FETCH = async url => {
    const fetchObj = new Fetcher(url);
    return fetchObj.start();
};

export const SWR_POST_FETCH = async (url, data) => {
    const fetchObj = new Fetcher(url, 'POST', data);
    return fetchObj.start();
};

export const SWR_POST_FILE_FETCH = async (url, type, desc, user, file) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('desc', desc);
    formData.append('user', user);
    formData.append('file', file);
    const fetchObj = new Fetcher(url, 'POST', formData);
    fetchObj.setHasFile(true);
    return fetchObj.start();
};

export const SWR_PATCH_FETCH = async (url, data) => {
    const fetchObj = new Fetcher(url, 'PATCH', data);
    return fetchObj.start();
};

export const SWR_PUT_FETCH = async (url, data) => {
    const fetchObj = new Fetcher(url, 'PUT', data);
    return fetchObj.start();
};

export const SWR_DELETE_FETCH = async (url, data) => {
    const fetchObj = new Fetcher(url, 'DELETE', data);
    return fetchObj.start();
};