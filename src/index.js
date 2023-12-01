"use strict"

import jikanService from "./services/jikan.js";

const gallery = document.getElementById("gallery");
const form = document.getElementById("form_search");
const button_clear = document.getElementById("button_clear");
const dropdown_sort_type = document.getElementById("sort_name");
const button_sort_direction = document.getElementById("sort_direction");
const button_clear_filter = document.getElementById("button_clear_filter");
const button_all_filter = document.getElementById("button_all_filter");
const filter = document.querySelectorAll('[name="filter"][id^="genre_"]');

let data = [];
let excluded = [];
let sortType = "";
let sortDirection = "Ascending";

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

const clearSelectedInQuery = () => {
    document
        .querySelectorAll('[name="genre"][id^="genre_"]')
        .forEach(element => element.checked = false);
};

const clearSelectedInFilter = () => {
    filter.forEach(element => element.checked = false);
    renderData();
};

const selectAllInFilter = () => {
    filter.forEach(element => element.checked = true);
    renderData();
};

const createCard = ({ images, title, type, year, genres }) => {
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

    const titleHeading = document.createElement("h2");
    titleHeading.textContent = title.title;

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
    card.appendChild(titleHeading);
    card.appendChild(undertitle);
    card.appendChild(genrelistContainer);
    gallery.appendChild(card);
};

const excludeFilter = (anime) => {
    return !anime.genres
        .some(genre => excluded.some(ex => genre.mal_id === ex));
};

const categorySort = (a, b) => {
    const direction = sortDirection === "Ascending" ? 1 : -1;
    switch (sortType) {
        case "title":
        default:
            return a.title.title.localeCompare(b.title.title) * direction;
        case "year":
            return (a.year - b.year) * direction;
        case "type":
            return a.type.localeCompare(b.type) * direction;
    }
};

const renderData = () => {
    gallery.innerHTML = "";
    data
        .sort((a, b) => categorySort(a, b))
        .filter(anime => excludeFilter(anime))
        .forEach(anime => createCard(anime));
};

document.addEventListener("DOMContentLoaded", async e => {
    data = [];
    excluded = [];
    sortType = dropdown_sort_type.value;
    sortDirection = button_sort_direction.innerText;

    /* const result = await jikanService.getAnime();
    data = [...result];

    renderData(); */
});

form.addEventListener("submit", async e => {
    e.preventDefault();

    const result = await jikanService.getAnime(parseForm());
    data = [...result];
    
    
    console.log(data);
    renderData();
});

button_clear.addEventListener("click", clearSelectedInQuery);

dropdown_sort_type.addEventListener("change", e => {
    sortType = e.target.value;
    renderData();
});

button_sort_direction.addEventListener("click", e => {
    e.target.textContent = e.target.textContent === "Ascending" ? "Descending" : "Ascending";
    sortDirection = e.target.textContent;
    renderData();
});

button_clear_filter.addEventListener("click", clearSelectedInFilter);

button_all_filter.addEventListener("click", selectAllInFilter);

filter.forEach(element => {
    element.addEventListener("change", ev => {
        console.log(ev.target.value);
    });
});