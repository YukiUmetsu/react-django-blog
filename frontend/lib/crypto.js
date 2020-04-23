import CryptoJS from 'crypto-js';
import {isEmpty} from "./utils";
import {ANGO_SESSION_NAME} from "../constants";

// encrypting on client side. better than nothing data protection.

export const code = (text, key = null) => {
    key = getKeyFromSessionStorage(key);
    return CryptoJS.AES.encrypt(text, key).toString();
};

export const decode = (codedText, key = null) => {
    key = getKeyFromSessionStorage(key);
    return CryptoJS.AES.decrypt(codedText, key);
};

const getKeyFromSessionStorage = (key) => {
    if(isEmpty(key) && typeof sessionStorage !== "undefined"){
        return sessionStorage.getItem(ANGO_SESSION_NAME)
    } else {
        return key;
    }
};

export const generateRandomStr = () => {
    let wordArray = CryptoJS.lib.WordArray.random(8);
    return CryptoJS.enc.Hex.stringify(wordArray).substring(3);
};