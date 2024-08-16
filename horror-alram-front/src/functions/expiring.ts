import axios from 'axios';
import { ResponseError, requestMovieApi } from './upcoming';

/*
id: 영화 아이디(long)
title: 영화 제목(문자열)
posterPath: 영화 포스터 uri
expiredDate: 스트리밍 종료일
*/

interface ExpiringMovie {
    id: number;
    title: string;
    posterPath: string;
    expiredDate: string;
}
interface ExpiringMovieResponse {
    movies: Array<ExpiringMovie>;
    error: ResponseError;
}

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