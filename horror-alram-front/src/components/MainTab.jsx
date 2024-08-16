import {
  Route,
  Link,
  useLocation,
  Routes,
} from 'react-router-dom'
import axios from 'axios';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AlramSwitchs } from "./AlramSwitchs"
import { MovieList } from "./MovieList"
import MovieImageList from './ImageList';
import MovieOverViewDialog from './MovieOverViewDialog';
import { StreamingTimeline } from "./StreamingTimeline"
import Detail from "./MovieDetail"
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getReleasingMovies from '../functions/releasing';
import requestMovieApi from '../functions/requestMovie';
import getExpiringMovies from '../functions/expiring';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


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


export default function MainTabs() {
  const { data: upcomingMovies, isLoading: upcomingMoviesLoading, error: upcomingMoviesError } = useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: async () => requestMovieApi(async () => await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/upcoming`)),
  });
  const { data: streamingMovies, isLoading: streamingMoviesLoading, error: streamingMoviesError } = useQuery({
    queryKey: ['streamingMovies'],
    queryFn: async () =>  requestMovieApi(async () => await axios.get(`${process.env.REACT_APP_MOVIE_API_URL}/api/releasing`)),
  });
  const { data: releasingMovies, isLoading: releasingMoviesLoading, error: releasingMoviesError } = useQuery({
    queryKey: ['releasingMovies'],
    queryFn: async () => getReleasingMovies(),
  });

  const isDesktop = useMediaQuery('(min-width:756px)');
  // 라우터에서 현재 경로를 가져와서 탭의 value로 사용 
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'upcoming';
  const [value, setValue] = useState(getTabValue(path));
  // 영화 상세 정보 다이얼로그에 쓰이는 state
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({});


  useEffect(() => {
    window.history.replaceState(null, '', `/${getTabPath(value)}`);
  }, [value]);


  if (upcomingMoviesLoading || streamingMoviesLoading || releasingMoviesLoading) {
    return <CircularProgress color='secondary' />;
  }
  if (upcomingMoviesError || streamingMoviesError || releasingMoviesError) {
    return <div>서버 문제로 정보를 가져올 수 없습니다.</div>;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOpen = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <ThemeProvider theme={theme}>
        <Tabs
          value={value} onChange={handleChange}
          indicatorColor="secondary"
          textColor="white"
          variant={isDesktop ? "fullWidth" : "scrollable"}
          allowScrollButtonsMobile
          scrollButtons
          centered
        >
          <Tab label="개봉 예정" value="upcoming" component={Link} to="/upcoming" />
          <Tab label="개봉중" value="releasing" component={Link} to="/releasing" />
          <Tab label="알람 설정" value="alram" component={Link} to="/alram" />
          <Tab label="스트리밍 종료 예정" value="streamingexpired" component={Link}
            to="/streamingexpired" />
        </Tabs>
      </ThemeProvider>
      <Routes>
        <Route path="upcoming" element={<MovieList
          imageList={<MovieImageList movies={upcomingMovies.movies} error={upcomingMovies.error}
            handleOpen={handleOpen} guideText={"개봉 예정 영화가 없습니다."} />}
          movieOverViewDialog={<MovieOverViewDialog open={open} handleClose={handleClose}
            selectedMovie={selectedMovie} />}
        />} />
        <Route path="releasing" element={<MovieList
          imageList={<MovieImageList movies={releasingMovies.movies} error={releasingMovies.error}
            handleOpen={handleOpen} guideText={"개봉 중인 영화가 없습니다."} />}
          movieOverViewDialog={<MovieOverViewDialog open={open} handleClose={handleClose}
            selectedMovie={selectedMovie} />}
        />} />
        <Route path="alram" element={<AlramSwitchs />} />
        <Route path="streamingexpired" element={<StreamingTimeline
          movies={streamingMovies.movies} error={streamingMovies.error}
        />} />
        <Route path="movie/:id" element={<Detail />} />
      </Routes>
    </Container>
  );
}

function getTabValue(path) {
  if (path === 'upcoming') {
    return 'upcoming';
  } else if (path === 'alram') {
    return 'alram';
  } else if (path === 'streamingexpired') {
    return 'streamingexpired';
  } else if (path === 'releasing') {
    return 'releasing';
  }
  return '/';
}

function getTabPath(value) {
  if (value === 'upcoming') {
    return 'upcoming';
  } else if (value === 'alram') {
    return 'alram';
  } else if (value === 'streamingexpired') {
    return 'streamingexpired';
  } else if (value === 'releasing') {
    return 'releasing';
  }
  return '/';
}