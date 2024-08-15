import axios from 'axios';

interface MovieResponse {
    id: number;
    title: string;
    poster_path: string;
}

export interface Movies {
    movies: MovieResponse[] | unknown | null;
    error: Error | unknown | null;
}

async function getUpcomingMovies(): Promise<Movies> {
    const upcomingMovies: Movies = {
        movies: null,
        error: null
    };
    try {
        const response = await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/upcoming`);
        upcomingMovies.movies = response.data;
        return upcomingMovies;

    }
    catch (error) {
        upcomingMovies.error = error;
        return upcomingMovies;

    }
}

export default getUpcomingMovies;

