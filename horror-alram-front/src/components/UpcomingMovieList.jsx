import Container from '@mui/material/Container';
import {ListSubheader } from '@mui/material';


export function UpcomingMovieList({ imageList, movieOverViewDialog, header}) {

  return (
    <Container>
      <ListSubheader sx={
        {
          backgroundColor: '#2F4F4F',
          textAlign: 'center',
          color: 'white',
        }
      }> {header}</ ListSubheader>
      {imageList}
      {movieOverViewDialog}
    </Container>
  );
}
