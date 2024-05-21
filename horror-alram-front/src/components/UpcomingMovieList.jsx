import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';

export function UpcomingMovieList() {
  const matches = useMediaQuery('(min-width:600px)');
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleClickOpen = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getUpcomingMovies().then((response) => {
      setMovies(response.data);
    }).catch((error) => {
     alert('서버 문제로 영화 정보를 가져오지 못했습니다. 다시 시도해주세요.');
    });
  }, []);


  return (
      <Container>
        <ImageList sx={{ width: '100%', height: '100%' }} cols={matches ? 3 : 2}
          rowHeight={matches ? 600 : 300}>
          <ImageListItem key="Subheader" cols={3} style={{ height: 'auto' }}>
            <ListSubheader component="div">개봉 예정 영화</ListSubheader>
          </ImageListItem>
          {movies.length > 0 && movies.map((movie) => (
            <ImageListItem key={movie.id} onClick={() => handleClickOpen(movie)}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={movie.title} />
              <ImageListItemBar
                title={movie.title}
                subtitle={movie.releaseDate}
                position="overlay"
              />
            </ImageListItem>
          ))}
        </ImageList>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedMovie?.title}</DialogTitle>
          <DialogContent>
            {selectedMovie?.overview}
          </DialogContent>
        </Dialog>
      </Container>
  );
}


async function getUpcomingMovies() {
  return await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/upcoming`);
}