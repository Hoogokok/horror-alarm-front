import axios, { AxiosResponse } from 'axios';
import { MovieResponses, ResponseError } from '../type/movie';

export default async function requestMovieInfo(request: () => Promise<AxiosResponse | ResponseError>): Promise<MovieResponses> {
    const requestResultInfo: MovieResponses = {
        movies: [],
        error: {
            data: {
                message: '',
                status: 0
            },
            isError: false
        }
    };
    const response: AxiosResponse | ResponseError = await requestMovieApi(request);
    if ((response as ResponseError).isError !== undefined) {
        requestResultInfo.error = response as ResponseError;
        return requestResultInfo;
    }
    requestResultInfo.movies = response.data;
    return requestResultInfo;
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