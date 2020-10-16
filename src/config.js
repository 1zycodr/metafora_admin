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
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJhZG1pbiIsIm5hbWUiOiLQndC40LrQvtC90L7QsiDQktC40YLQsNC70LjQuSIsInJvbGUiOiJhZG1pbiJ9.CyZVmcGu5pHaJ33GBA7f4wX2lcjHX4ThhCSDOPqS7M0';
}

export const saveToken = token => {
    if(localStorage) {
        localStorage.setItem('token', token);
    }
}