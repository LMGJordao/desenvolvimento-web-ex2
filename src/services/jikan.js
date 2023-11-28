"use strict";

const baseURL = 'https://api.jikan.moe/v4';
const defaultParams = { sfw: true };

const createURL = (resource, params) => {
    const url = new URL(resource, baseURL);
    const query = new URLSearchParams({
        ...defaultParams,
        ...params
    });
    query.forEach((value, key) => {
        url.searchParams.append(key, value);
    });

    return url;
}

const getAll = () => {
    const options = {
        method: "GET"
    };

    const url = createURL("anime", {});

    console.log(url);
};

const jikanService = {
    getAll
};

export default jikanService;