import Container from '@mui/material/Container';
import {ListSubheader } from '@mui/material';


export function UpcomingMovieList({ imageList, movieOverViewDialog }) {

  return (
    <Container>
      <ListSubheader sx={
        {
          backgroundColor: '#2F4F4F',
          textAlign: 'center',
          color: 'white',
        }
      }> 개봉 예정 영화</ ListSubheader>
      {imageList}
      {movieOverViewDialog}
    </Container>
  );
}
