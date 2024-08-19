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

export interface ExpiringMovie {
    id: number;
    title: string;
    posterPath: string;
    expiredDate: string;
}

interface GenericResponse<T> {
    movies: Array<T>;
    error: ResponseError;
}

export type MovieResponses = GenericResponse<MovieResponse>;
export type ExpiringMovieResponse = GenericResponse<ExpiringMovie>;
