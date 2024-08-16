import axios from 'axios';
import { ResponseError } from './upcoming';

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
    error: ResponseError | undefined;
}

export default async function getExpiringMovies(): Promise<ExpiringMovieResponse> {
    const expiringMovies: ExpiringMovieResponse = {
        movies: [],
        error: undefined
    };
    try {
        const response = await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/streaming/expired`);
        expiringMovies.movies = response.data;
        return expiringMovies;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            expiringMovies.error = {
                data: {
                    message: error.message,
                    status: error.response?.status || 500
                }
            };
            return expiringMovies;
        }
        expiringMovies.error = {
            data: {
                message: '알 수 없는 에러',
                status: 500
            }
        };
        return expiringMovies;
    }
}