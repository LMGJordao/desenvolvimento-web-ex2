/**
 * Class for holding and managing the state of the page.
 */
export default class App {
    static #completeGenreFilter = [1, 2, 4, 7, 8, 10, 13, 18, 19, 22, 23, 24, 25, 27, 36, 37, 42];

    constructor() {
        this.data = [];                     // Holds a copy of the data recieved by the API. Data is an object.
        this.excludedGenreFilter = [];      // Holds the Genres selected to be excluded. Genres are numbers.
        this.sortType = "";                 // The property to be used in the comparisons (Ex: "title", "year").
        this.sortDirection = "Ascending";   // Can be either "Ascending" or "Descending".
    }

    clearExcludedGenreFilter() {
        this.excludedGenreFilter = [];
    }

    fillExcludedGenreFilter() {
        this.excludedGenreFilter = App.#completeGenreFilter;
    }

    addToExcludedGenreFilter(genre) {
        if (!this.excludedGenreFilter.includes(genre))
            this.excludedGenreFilter.push(genre);
    }

    removeFromExcludedGenreFilter(genre) {
        const idx = this.excludedGenreFilter.indexOf(genre);
        if (idx !== -1)
            this.excludedGenreFilter.splice(idx, 1);
    }

    replaceData(newData) {
        this.data = [...newData];
    }

    setSortDirection(direction) {
        this.sortDirection = direction;
    }

    setSortType(type) {
        this.sortType = type;
    }

    /**
     * Compares `a` and `b` to check if they're in order based on the selected property and direction.
     * 
     * @returns A number `<=0` if `a` and `b` are in order and `>0` otherwise.
     */
    #sortBySelectedProperty(a, b) {
        [].sort
        const directionModifier = this.sortDirection === "Ascending" ? 1 : -1;
        switch (this.sortType) {
            case "title":
            default:
                return a.title.title.localeCompare(b.title.title) * directionModifier;
            case "year":
                return (a.year - b.year) * directionModifier;
            case "type":
                return a.type.localeCompare(b.type) * directionModifier;
        }
    }

    /**
     * Check if this Anime's genres are present in the excluded genre list.
     * 
     * @returns `true` if no genres are excluded and `false` otherwise.
     */
    #filterOutExcludedGenres(anime) {
        return !anime.genres 
            .some(animeGenre => // For all the genres in this anime.
                // Check if genre is present in the excluded list.
                this.excludedGenreFilter.includes(animeGenre.mal_id));
    }

    /**
     * @returns The data sorted and filtered according to the App state.
     */
    get renderData() {
        return this.data
            .sort((a, b) => this.#sortBySelectedProperty(a, b))
            .filter(anime => this.#filterOutExcludedGenres(anime));
    }
}