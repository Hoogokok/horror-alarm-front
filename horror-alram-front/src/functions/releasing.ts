import axios from 'axios';

class ReleasingMovies {
    constructor() {
        this.movies = [];
        this.error = null;
    }
}

export default async function getReleasingMovies() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/releasing`);
        const releasingMovies = new ReleasingMovies();
        releasingMovies.movies = response.data;
        return releasingMovies;
    } catch (error) {
        const releasingMovies = new ReleasingMovies();
        releasingMovies.error = error;
        return releasingMovies;
    }
}