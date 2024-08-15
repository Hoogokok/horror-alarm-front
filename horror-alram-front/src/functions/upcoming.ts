import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
export interface MovieResponse {
    id: number;
    title: string;
    poster_path: string;
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
    const response: AxiosResponse | ResponseError = await requstUpcomingMovies();
    if ('status' in response.data) {
        upcomingMovies.error = response;
        return upcomingMovies;
    }
    upcomingMovies.movies = response.data;
    return upcomingMovies;
}

async function requstUpcomingMovies(): Promise<AxiosResponse | ResponseError> {
    try {
        return await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/upcoming`);
    }
    catch (error) {
        console.log('상영 예정 중 에러 발생');
        if (axios.isAxiosError(error)) {
            console.error(error);
            return {
                data: {
                    message: error.message,
                    status: error.response?.status || 500
                }
            };
        }
    }
    return {
        data: {
            message: '알 수 없는 에러',
            status: 500
        }
    };
}

