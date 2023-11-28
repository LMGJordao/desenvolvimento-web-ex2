"use strict";

const baseURL = 'https://api.jikan.moe/v4/';
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

const getAnime = async (query) => {
    const url = createURL("anime", query);

    return fetch(url).then(res => res.json());//TODO filter to relevant data
};

const jikanService = {
    getAnime
};

export default jikanService;