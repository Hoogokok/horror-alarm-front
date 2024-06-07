import {
  Route,
  Link,
  useLocation,
  Routes,
} from 'react-router-dom'
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { PermissionSwitch } from "./PermissionSwitch"
import { MovieList } from "./MovieList"
import MovieImageList from './ImageList';
import MovieOverViewDialog from './MovieOverViewDialog';
import { StreamingTimeline } from "./StreamingTimeline"
import Detail from "./MovieDetail"
import { useEffect, useState } from "react";
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

export default function MainTabs({ upcomingMovies, streamingMovies, releasingMovies }) {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'upcoming';
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [value, setValue] = useState(getTabValue(path));


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
        <Route path="alarm" element={<PermissionSwitch />} />
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