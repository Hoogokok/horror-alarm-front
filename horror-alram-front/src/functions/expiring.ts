import axios, { AxiosResponse } from 'axios';
import { ExpiringMovieResponse, ResponseError } from '../type/movie';
import { requestMovieApi } from './requestMovie';
/*
id: 영화 아이디(long)
title: 영화 제목(문자열)
posterPath: 영화 포스터 uri
expiredDate: 스트리밍 종료일
*/


export default async function getExpiringMovies(expiringMovies:
    ExpiringMovieResponse = {
        movies: [],
        error: {
            data: {
                message: '',
                status: 0
            },
            isError: false
        }
    }
): Promise<ExpiringMovieResponse> {

    const response: AxiosResponse | ResponseError = await requestMovieApi(async () => await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/streaming/expired`));
    if ((response as ResponseError).isError !== undefined) {
        expiringMovies.error = response as ResponseError;
        return expiringMovies;
    }

    expiringMovies.movies = response.data;

    return expiringMovies;
}