import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2F4F4F',
    },
    secondary: {
      main: '#CD5C5C',
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#2F4F4F',
          textAlign: 'center',
          color: '#F8F8FF',
        },
      },
    },
  },
});
const Div = styled('div')({
  margin: 10,
  color: 'white',
});

export function StreamingTimeline() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/streaming/expired`)
      .then((response) => {
        setMovies(response.data.expiredMovies);
      }).catch((error) => {
        alert('서버 문제로 영화 정보를 가져오지 못했습니다. 다시 시도해주세요.');
      });
  }, []);

  return (
    movies.length === 0 ?
      <Div >종료 예정인 스트리밍이 없습니다</Div> :
      <ThemeProvider theme={theme}>
      <Timeline position="alternate">
        {movies.map((movie) => (
          <TimelineItem key={movie.id}>
            <TimelineSeparator>
              <TimelineDot color="secondary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Link to={`/movie/${movie.id}`}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <Typography>{movie.title}</Typography>
              </Link>
              <Typography color={"white"}>{movie.expiredDate}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      </ThemeProvider>
  );
}