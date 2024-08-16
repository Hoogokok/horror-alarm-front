import axios from 'axios';

interface  ExpiringMovieResponse {
    movies: Array<any>;
    error: any;
}

export default async function getExpiringMovies() {
    const expiringMovies: ExpiringMovieResponse = {
        movies: [],
        error: undefined
    };
    try {
        const response = await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/streaming/expired`);
        expiringMovies.movies = response.data;
        return expiringMovies;
    } catch (error) {
        console.error('만료된 영화 에러 발생');
        expiringMovies.error = error;
        return expiringMovies;
    }
}