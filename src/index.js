"use strict"

import App from "./App.js";
import jikanService from "./services/jikan.js";

const container_gallery = document.getElementById("container_gallery");
const form_search_query = document.getElementById("form_search_query");
const button_clear_search_genre_selection = document.getElementById("button_clear_search_genre_selection");
const dropdown_sort_type = document.getElementById("dropdown_sort_type");
const button_sort_direction = document.getElementById("button_sort_direction");
const button_clear_filter = document.getElementById("button_clear_filter");
const button_all_filter = document.getElementById("button_all_filter");
const filter = document.querySelectorAll('[name="filter"][id^="genre_"]');

const appState = new App();

const parseFormSearchQuery = () => {
    let output = {};

    const title = form_search_query.elements.title;
    if (title.value.length !== 0 && title.value !== null) {
        output = {
            ...output,
            q: title.value
        };
    };

    const genres = form_search_query.elements.genre;
    let selectedGenres = "";
    genres.forEach(genre => {
        if (genre.checked) {
            selectedGenres = selectedGenres.concat(`${genre.value} `);
        }
    });
    selectedGenres = selectedGenres.trim().replaceAll(" ", ",");
    if (selectedGenres.length !== 0 && selectedGenres !== null) {
        output = {
            ...output,
            genres: selectedGenres
        };
    };

    const type = form_search_query.elements.types;
    if (type.value.length !== 0 && type.value !== null) {
        output = {
            ...output,
            type: type.value
        };
    };

    return output;
};

const createCard = ({ images, title, type, year, genres }) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardPoster = document.createElement("img");
    cardPoster.classList.add("card__poster");
    cardPoster.onerror = (e) => {
        cardPoster.onerror = null;
        cardPoster.src = "./src/resources/images/fallback_poster.png";
    };
    if (images["jpg"] !== undefined && images["jpg"]["image_url"] !== undefined && images["jpg"]["image_url"] !== null)
        cardPoster.src = images.jpg.image_url;
    else
        cardPoster.src = "./src/resources/images/fallback_poster.png";
    cardPoster.alt = `Poster for ${title.title}`;

    const cardTextContent = document.createElement("div");
    cardTextContent.classList.add("card__text_content");

    const cardTitle = document.createElement("h2");
    cardTitle.classList.add("card__title");
    cardTitle.textContent = title.title;

    const cardSubtitle = document.createElement("div");
    cardSubtitle.classList.add("card__subtitle");

    const cardYear = document.createElement("p");
    cardYear.innerHTML = `<b>Year:</b> ${year !== null ? year : "-"}`;

    const cardAnimeType = document.createElement("p");
    cardAnimeType.innerHTML = `<b>Type:</b> ${type}`;
    
    const genrelistContainer = document.createElement("div");
    genrelistContainer.classList.add("card__genre_list");

    genres.forEach(genre => {
        const genreElement = document.createElement("div");
        genreElement.classList.add("genre_tag");
        genreElement.textContent = genre["name"];
        genrelistContainer.appendChild(genreElement);
    });
    
    cardSubtitle.appendChild(cardYear);
    cardSubtitle.appendChild(cardAnimeType);
    cardTextContent.appendChild(cardTitle);
    cardTextContent.appendChild(cardSubtitle);
    cardTextContent.appendChild(genrelistContainer);
    card.appendChild(cardPoster);
    card.appendChild(cardTextContent);
    container_gallery.appendChild(card);
};

const renderData = () => {
    container_gallery.innerHTML = "";
    appState
        .renderData
        .forEach(anime => createCard(anime));
};

const clearSelectedInQuery = () => {
    document
        .querySelectorAll('[name="genre"][id^="genre_"]')
        .forEach(element => element.checked = false);
};
button_clear_search_genre_selection.addEventListener("click", clearSelectedInQuery);

const chageSortType = () => {
    appState.setSortType(dropdown_sort_type.value);
    renderData();
};
dropdown_sort_type.addEventListener("change", chageSortType);

const toggleSortDirection = () => {
    button_sort_direction.textContent = button_sort_direction.textContent === "Ascending" ? "Descending" : "Ascending";
    appState.setSortDirection(button_sort_direction.textContent);
    renderData();
};
button_sort_direction.addEventListener("click", toggleSortDirection);

const clearSelectedInGenreFilter = () => {
    filter.forEach(element => element.checked = false);

    appState.clearExcludedGenreFilter();

    renderData();
};
button_clear_filter.addEventListener("click", clearSelectedInGenreFilter);

const selectAllInGenreFilter = () => {
    filter.forEach(element => element.checked = true);

    appState.fillExcludedGenreFilter();

    renderData();
};
button_all_filter.addEventListener("click", selectAllInGenreFilter);

filter.forEach(element => {
    element.addEventListener("change", e => {
        const val = Number.parseInt(e.target.value);
        if (e.target.checked) {
            appState.addToExcludedGenreFilter(val);
        } else {
            appState.removeFromExcludedGenreFilter(val);
        }
        renderData();
    });
});

document.addEventListener("DOMContentLoaded", async e => {
    clearSelectedInGenreFilter();
    appState.setSortType(dropdown_sort_type.value);
    appState.setSortDirection(button_sort_direction.textContent);

    const result = await jikanService.getAnime();
    console.log(result);
    appState.replaceData(result);

    renderData();
});

form_search_query.addEventListener("submit", async e => {
    e.preventDefault();

    const result = await jikanService.getAnime(parseFormSearchQuery());
    appState.replaceData(result);
    
    renderData();
});

document.getElementById("title").addEventListener("focusin", e => {
    document.getElementById("search_genres").style.display = "flex";
    document.getElementById("bar").classList.toggle("search__bar_focus");
    if(document.getElementsByClassName("shadow").length === 0) {
        let shadow = document.createElement("span");
        shadow.classList.add("shadow");
        shadow.addEventListener("click", e => {
            document.getElementById("search_genres").style.display = "none";
            shadow.remove();
        });
        document.body.appendChild(shadow);
    }
});
document.getElementById("title").addEventListener("focusout", e => {
    document.getElementById("bar").classList.toggle("search__bar_focus")
});