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

export interface MovieResponses {
    movies: Array<MovieResponse>;
    error: ResponseError;
}

export interface ExpiringMovie {
    id: number;
    title: string;
    posterPath: string;
    expiredDate: string;
}
export interface ExpiringMovieResponse {
    movies: Array<ExpiringMovie>;
    error: ResponseError;
}
