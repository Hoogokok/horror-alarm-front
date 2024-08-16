import axios, { AxiosResponse } from 'axios';
import { requestMovieApi } from './upcoming';
import { Movies, ResponseError } from '../type/movie';

export default async function getReleasingMovies() {
    const releasingMovies: Movies = {
        movies: [],
        error: {
            data: {
                message: '',
                status: 0
            },
            isError: false
        }
    };
    const response: AxiosResponse | ResponseError = await requestMovieApi(async () => await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/releasing`));
    if ((response as ResponseError).isError !== undefined) {
        releasingMovies.error = response as ResponseError;
        return releasingMovies;
    }
    releasingMovies.movies = response.data;
    return releasingMovies;
}