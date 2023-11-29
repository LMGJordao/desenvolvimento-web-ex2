"use strict"

import jikanService from "./services/jikan.js";

const gallery = document.getElementById("gallery");

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

const clearSelected = () => {
    document
        .querySelectorAll('[id^="genre_"]')
        .forEach(element => element.checked=false);
};

const createCard = ({images, title, type, year, genres}) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.onerror = (e) => {
        img.onerror = null;
        img.src = "./src/resources/images/fallback_poster.png";
    };
    if (images["jpg"] !== undefined && images["jpg"]["image_url"] !== undefined && images["jpg"]["image_url"] !== null)
        img.src = images.jpg.image_url;
    else
        img.src = "./src/resources/images/fallback_poster.png";

    /* const titleHeading = document.createElement("h2");
    titleHeading.textContent = title; */

    const undertitle = document.createElement("p");
    undertitle.textContent = `Year: ${year !== null ? year : "-"}\nType: ${type}`;

    const genrelistContainer = document.createElement("div");
    const genrelistLabel = document.createElement("p");
    genrelistLabel.textContent = "Genre";
    const genrelist = document.createElement("ul");
    genres.forEach(genre => {
        const genreElement = document.createElement("li");
        genreElement.textContent = genre["name"];
        genrelist.appendChild(genreElement);
    });
    genrelistContainer.appendChild(genrelistLabel);
    genrelistContainer.appendChild(genrelist);

    card.appendChild(img);
    //card.appendChild(titleHeading);
    card.appendChild(undertitle);
    card.appendChild(genrelistContainer);
    gallery.appendChild(card);
};

const form = document.getElementById("form_search");
form.addEventListener("submit", e => {
    e.preventDefault();

    jikanService
        .getAnime(parseForm())
        .then(res => {
            res.forEach(anime => createCard(anime))
        });

    
});

document.getElementById("button_clear")
    .addEventListener("click", clearSelected);