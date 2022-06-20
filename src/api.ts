const API_KEY = "a2d7ad8d8018141b9c98d47ee554ff2a";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
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

interface ITvSeriese {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvSerieseResult {
  page: number;
  results: ITvSeriese[];
  total_pages: number;
  total_results: number;
}

//On the /tv (tv series) page implement sliders for: Latest tv, Top Rated tv and Upcoming tv.
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
