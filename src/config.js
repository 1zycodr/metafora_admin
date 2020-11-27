export const getURL = () => {
    if(localStorage) {
        const APIURL = localStorage.getItem('serviceUrl');
        if(APIURL) {
            return APIURL;
        }
    }
    return 'http://185.144.29.230:8082/';
}

export const setURL = url => {
    if(localStorage) {
        localStorage.setItem('serviceUrl', url);
    }
}

export const request = (url) => {
    return `${getURL()}${url}`;
}

export const getToken = () => {
    if(localStorage) {
        const token = localStorage.getItem('token');
        if(token) {
            return token;
        }
        return false;
    }
    return '';
}

export const saveToken = token => {
    if(localStorage) {
        localStorage.setItem('token', token);
    }
}
