export const APIURL = 'http://127.0.0.1:8082/';

export const request = (url) => {
    return `${APIURL}${url}`;
}

export const getToken = () => { 
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJhZG1pbiIsIm5hbWUiOiLQndC40LrQvtC90L7QsiDQktC40YLQsNC70LjQuSIsInJvbGUiOiJhZG1pbiJ9.CyZVmcGu5pHaJ33GBA7f4wX2lcjHX4ThhCSDOPqS7M0';
}