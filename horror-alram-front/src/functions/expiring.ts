import axios from 'axios';
import { requestMovieApi } from './upcoming';
import { ResponseError, ExpiringMovieResponse } from '../type/movie';
/*
id: 영화 아이디(long)
title: 영화 제목(문자열)
posterPath: 영화 포스터 uri
expiredDate: 스트리밍 종료일
*/


export default async function getExpiringMovies(): Promise<ExpiringMovieResponse> {
    const expiringMovies: ExpiringMovieResponse = {
        movies: [],
        error: {
            data: {
                message: '',
                status: 0
            },
            isError: false
        }
    };
    const response = await requestMovieApi(async () => await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/streaming/expired`));
    expiringMovies.movies = response.data;

    return expiringMovies;
}