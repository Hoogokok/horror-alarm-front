import axios from 'axios';

class UpcomingMovies {
    constructor() {
        this.movies = [];
        this.error = null;
    }
}

async function getUpcomingMovies() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/upcoming`);
        const upcomingMovies = new UpcomingMovies();
        upcomingMovies.movies = response.data;
        return upcomingMovies;

    }
    catch (error) {
        const upcomingMovies = new UpcomingMovies();
        upcomingMovies.error = error;
        return upcomingMovies;

    }
}

export default getUpcomingMovies;

