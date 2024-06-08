import {
  Route,
  Link,
  useLocation,
  Routes,
} from 'react-router-dom'
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AlramSwitchs } from "./AlramSwitchs"
import AlramSwitch from "./AlramSwitch"
import { MovieList } from "./MovieList"
import MovieImageList from './ImageList';
import MovieOverViewDialog from './MovieOverViewDialog';
import { StreamingTimeline } from "./StreamingTimeline"
import Detail from "./MovieDetail"
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  handleAlarmPermission,
  handleUpcomingMovieSubscribe,
  handleNetflixSubscribe,
  handleInitialSubscription
} from "../functions/messaging";

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

const intialSubscription = await handleInitialSubscription();
const checkedPermission = intialSubscription.permission;
const checkedUpcomingMovie = intialSubscription.subscribe[0];
const checkedNetflix = intialSubscription.subscribe[1];

export default function MainTabs({ upcomingMovies, streamingMovies, releasingMovies }) {
  // 라우터에서 현재 경로를 가져와서 탭의 value로 사용 
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'upcoming';
  const [value, setValue] = useState(getTabValue(path));
  // 영화 상세 정보 다이얼로그에 쓰이는 state
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  // 알람 설정에 쓰이는 state
  const [permission, setPermission] = useState(checkedPermission === "granted");
  const [subscribeUpcoming, setSubscribeUpcoming] = useState(checkedUpcomingMovie);
  const [subscribeNetflix, setSubscribeNetflix] = useState(checkedNetflix);


  useEffect(() => {
    window.history.replaceState(null, '', `/${getTabPath(value)}`);
  }, [value]);

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

  const changeAlarmPermission = async () => {
    await handleAlarmPermission().then(result => {
      setPermission((result) => (result === 'granted'));
    });
  };
  const changeUpcomingMovieSubscribe = async () => {
    await handleUpcomingMovieSubscribe(permission, subscribeUpcoming).then(result => {
      setSubscribeUpcoming((result) => (result.status === 'success'));
    });
  };
  
  const changeeNetflixSubscribe = async () => {
    await handleNetflixSubscribe(permission, subscribeNetflix).then(result => {
      setSubscribeNetflix((result) => (result.status === 'success'));
    });
  };


  return (
    <Container>
      <ThemeProvider theme={theme}>
        <Tabs
          value={value} onChange={handleChange}
          indicatorColor="secondary"
          textColor="white"
          centered
        >
          <Tab label="개봉 예정" value="upcoming" component={Link} to="/upcoming" />
          <Tab label="개봉중" value="releasing" component={Link} to="/releasing" />
          <Tab label="알람 설정" value="alarm" component={Link} to="/alarm" />
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
        <Route path="alarm" element={<AlramSwitchs />} />
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
  } else if (path === 'alarm') {
    return 'alarm';
  } else if (path === 'streamingexpired') {
    return 'streamingexpired';
  } else if (path === 'releasing') {
    return 'releasing';
  }
  return 'upcoming';
}

function getTabPath(value) {
  if (value === 'upcoming') {
    return 'upcoming';
  } else if (value === 'alarm') {
    return 'alarm';
  } else if (value === 'streamingexpired') {
    return 'streamingexpired';
  } else if (value === 'releasing') {
    return 'releasing';
  }
  return 'upcoming';
}