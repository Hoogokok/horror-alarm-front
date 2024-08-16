import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
export interface MovieResponse {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    theaters: Array<string>;
}

export interface ResponseError {
    data: {
        message: string;
        status: number;
    };
}

export interface Movies {
    movies: MovieResponse[] | undefined;
    error: ResponseError | undefined;
}

export async function getUpcomingMovies(): Promise<Movies> {
    const upcomingMovies: Movies = {
        movies: undefined,
        error: undefined
    };
    const response: AxiosResponse | ResponseError = await requestMovieApi(await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/upcoming`));
    if ('status' in response.data) {
        upcomingMovies.error = response;
        return upcomingMovies;
    }
    upcomingMovies.movies = response.data;
    return upcomingMovies;
}

async function requestMovieApi(
    request: () => Promise<AxiosResponse | ResponseError>
): Promise<AxiosResponse | ResponseError> {
    try {
        return request();
    }
    catch (error) {
        return handleResponseError(error);
    }
}

function handleResponseError(error: unknown): ResponseError {
    if (axios.isAxiosError(error)) {
        return {
            data: {
                message: error.message,
                status: error.response?.status || 500
            }
        };
    }
    return {
        data: {
            message: '알 수 없는 에러',
            status: 500
        }
    };
}