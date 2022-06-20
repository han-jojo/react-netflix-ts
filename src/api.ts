const API_KEY = "a2d7ad8d8018141b9c98d47ee554ff2a";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

//On the / (home) page implement sliders for: Latest movies, Top Rated Movies and Upcoming Movies.
export function getLatestMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getTopMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export interface ITvSeriese {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  original_name: string;
}

export interface IGetTvSerieseResult {
  page: number;
  results: ITvSeriese[];
  total_pages: number;
  total_results: number;
}

//TV series Latest, Top Rated and Upcoming.
export function getLatestTvSeries() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getPopularTvSeries() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getTopRatedTvSeries() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export interface IGetSearch {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

export interface SearchResult {
  adult?: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: Date;
  title?: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  first_air_date?: string;
  name?: string;
  origin_country?: string[];
  original_name?: string;
}

//Search
export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}&include_adult=true&region=kr`
  ).then((response) => response.json());
}
