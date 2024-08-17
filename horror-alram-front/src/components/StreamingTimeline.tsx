import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { ListSubheader, Theme } from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const theme: Theme = createTheme({
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

interface StreamingTimelineProps {
  movies: {
    expiredMovies: {
      expiredMovies: {
        id: number;
        title: string;
        expiredDate: string;
      }[];
    };
  };
  error: {
    isError: boolean;
  };
}

export function StreamingTimeline({ movies, error }: StreamingTimelineProps): JSX.Element {
  const expiredMovies = movies.expiredMovies.expiredMovies;
  return (
      <ListSubheader sx={
        {
          backgroundColor: '#2F4F4F',
          textAlign: 'center',
          color: 'white',
        }
      }> 스트리밍 종료 예정 영화
      {error.isError && <Div>서버 문제로 데이터를 불러오지 못합니다.</Div>}
      {!error.isError && expiredMovies.length === 0 && <Div>스트리밍 종료 예정인 영화가 없습니다.</Div>}
      {!error.isError && expiredMovies.length > 0 && <Timeline position="alternate">
        {expiredMovies.map((movie) => (
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
    </ListSubheader>
  );
}