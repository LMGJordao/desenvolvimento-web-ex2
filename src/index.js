"use strict"

import jikanService from "./services/jikan.js";

const parseForm = () => {
    let output = {};
    const form = document.getElementById("form_search");

    const title = form.elements.title;
    if (title.value.length !== 0 && title.value !== null) {
        output = {
            ...output,
            q: title.value
        };
    };

    const genres = form.elements.genre;
    let selectedGenres = "";
    genres.forEach(element => {
        if (element.checked) {
            selectedGenres = selectedGenres.concat(`${element.value} `);
        }
    });
    selectedGenres = selectedGenres.trim().replaceAll(" ", ",");
    if (selectedGenres.length !== 0 && selectedGenres !== null) {
        output = {
            ...output,
            genres: selectedGenres
        };
    };

    const type = form.elements.types;
    if (type.value.length !== 0 && type.value !== null) {
        output = {
            ...output,
            type: type.value
        };
    };

    return output;
};

const form = document.getElementById("form_search");
form.addEventListener("submit", e => {
    e.preventDefault();

    console.log(parseForm());
});