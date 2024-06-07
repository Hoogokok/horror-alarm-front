import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
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

export function StreamingTimeline({ movies, error }) {

  return (
    <ThemeProvider theme={theme}>
      {error && <Div>서버 문제로 데이터를 불러오지 못합니다.</Div>}
      {!error && movies.length === 0 && <Div>개봉 예정 중인 영화가 없습니다.</Div>}
      {!error && movies.length > 0 && <Timeline position="alternate">
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
      </Timeline>}
    </ThemeProvider>
  );
}