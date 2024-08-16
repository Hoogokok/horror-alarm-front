import axios, { AxiosResponse } from 'axios';

export interface MovieResponse {
    id: number;
    title: string;
    releaseDate: string;
    posterPath: string;
    overview: string;
    theaters: Array<string>;
}

export type ResponseError = {
    data?: {
        message: string;
        status: number;
    };
    isError: boolean;
}

export interface Movies {
    movies: MovieResponse[];
    error: ResponseError;
}

export async function getUpcomingMovies(): Promise<Movies> {
    const upcomingMovies: Movies = {
        movies: [],
        error: {
            data: {
                message: '',
                status: 0
            },
            isError: false
        }
    };
    const response: AxiosResponse | ResponseError = await requestMovieApi(async () => await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/upcoming`));
    if ((response as ResponseError).isError !== undefined) {
        upcomingMovies.error = response as ResponseError;
        return upcomingMovies;
    }
    upcomingMovies.movies = response.data;
    return upcomingMovies;
}

export async function requestMovieApi(
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
            },
            isError: true
        };
    }
    return {
        data: {
            message: '알 수 없는 에러',
            status: 500
        },
        isError: true
    };
}