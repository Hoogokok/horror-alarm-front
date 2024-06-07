import axios from 'axios';

class ExpiringMovieResponse {
    constructor() {
        this.movies = [];
        this.error = null;
    }
}

export default async function getExpiringMovies() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/streaming/expired`);
        const expiringMovies = new ExpiringMovieResponse();
        expiringMovies.movies = response.data;
        return expiringMovies;
    } catch (error) {
        const expiringMovies = new ExpiringMovieResponse();
        expiringMovies.error = error;
        return expiringMovies;
    }
}