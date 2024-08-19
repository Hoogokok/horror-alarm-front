import axios from 'axios';
import { useEffect, useState, } from "react";
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useMediaQuery, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

interface MobileMovie {
  title: string;
  posterPath: string;
  overview: string;
}

export default function Detail() {
  const [movie, setMovie] = useState({
    title: '',
    posterPath: '',
    overview: '',
  });
  const { id } = useParams();
  const isMobile = useMediaQuery('(max-width:600px)'); // 모바일 환경 감지

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/streaming/expired/detail/${id}`)
      .then((response) => {
        setMovie(response.data);
      }).catch((error) => {
        alert('서버 문제로 영화 정보를 가져오지 못했습니다. 다시 시도해주세요.');
      });
  }, [id]);

  if (isMobile) {
    return <MobileMovieDetail movie={movie} />;
  }
  return (
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        marginTop: 5,
        maxWidth: 500,
        flexGrow: 3,
        backgroundColor: '#1D3131'
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Img src={`${process.env.REACT_APP_POSTER_API_URL}${movie.posterPath}`} alt={movie.title} />
        </Grid>
        <Grid item xs container direction="row" spacing={2}>
          <Grid item xs>
            <Typography gutterBottom variant="h5" color={'white'}>
              {movie.title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" style={{ cursor: 'pointer' }} color={'white'}>
              {movie.overview}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

interface MobileMovieDetailProps {
  movie: {
    title: string;
    posterPath: string;
    overview: string;
  };
}

function MobileMovieDetail({ movie }: MobileMovieDetailProps) {
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!isMobile) {
    return null; // 모바일 환경이 아니면 렌더링하지 않음
  }

  return (

    <Accordion
      sx={{
        p: 2,
        margin: 'auto',
        marginTop: 5,
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: '#1D3131',
        '@media (max-width:600px)': {
          paddingBottom: '64px', // 하단 여백 값, 필요에 따라 조정
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#white' }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Img src={`${process.env.REACT_APP_POSTER_API_URL}${movie.posterPath}`} alt={movie.title} />
      </AccordionSummary>
      <AccordionDetails>
        <Typography color={'white'}>
          {movie.overview}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

