import axios from 'axios';

class ExpiringMovieResponse {
    constructor() {
        this.expiringMovies = [];
        this.error = null;
    }
}

async function getExpiringMovies() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/expiring`);
        const expiringMovies = new ExpiringMovieResponse();
        expiringMovies.expiringMovies = response.data;
        return expiringMovies;
    } catch (error) {
        const expiringMovies = new ExpiringMovieResponse();
        expiringMovies.error = error;
        return expiringMovies;
    }
}