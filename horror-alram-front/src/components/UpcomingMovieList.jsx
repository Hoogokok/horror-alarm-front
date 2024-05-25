import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import { useMediaQuery } from '@mui/material';
import { ImageList, ImageListItem, ImageListItemBar, ListSubheader } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

export function UpcomingMovieList() {
  const isMobile = useMediaQuery('(min-width:756px)');
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
      <ListSubheader sx={
        {
          backgroundColor: '#2F4F4F',
          textAlign: 'center',
          color: 'white',
        }
      }>

      개봉 예정 영화</ ListSubheader>
      <ImageList className="image-list" sx={{
        width: '100%',
        height: '100%',
        display: 'flex', // flex 레이아웃으로 변경
        flexDirection: isMobile ? 'row' : 'column', // 방향 설정
        flexWrap: 'nowrap', // 한 줄로 배치
        overflowY: isMobile ? 'auto' : 'initial', // 세로 스크롤 설정
        gap: 10,
      }}>
        {movies.length > 0 && movies.map((movie) => (
          <ImageListItem className='image-item' key={movie.id} onClick={() => handleClickOpen(movie)} sx={{ height: 150 }}>
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