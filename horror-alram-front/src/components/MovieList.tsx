import Container from '@mui/material/Container';
import { ListSubheader } from '@mui/material';
interface MovieListProps {
  imageList: JSX.Element;
  movieOverViewDialog: JSX.Element;
  header: any;
}


export function MovieList({ imageList, movieOverViewDialog, header }: MovieListProps) : JSX.Element {

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
