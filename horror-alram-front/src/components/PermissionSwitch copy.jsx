import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { memo, useCallback, useEffect, useState } from "react";
import {
  handleAlarmPermission,
  handleUpcomingMovieSubscribe,
  handleNetflixSubscribe,
  handleInitialSubscription
} from "../functions/messaging";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
const theme = createTheme({
  palette: {
    primary: {
      main: '#BC8F8F',
    },
  },
});

const LabelText = styled('span')({
  color: 'white', // 원하는 색깔로 변경
  textAlign: 'center',
});


export function PermissionSwitch({ alarmPermissionSwitch, upcomingSubscriptionSwitch, netflixSubscriptionSwitch }) {
  const [checkedPermission, setCheckedPermission] = useState(false);
  const [checkedUpcomingMovie, setCheckedUpcomingMovie] = useState(false);
  const [checkedNetflix, setCheckedNetflix] = useState(false);
  const isMobile = useMediaQuery('(min-width:756px)');

  const handleAlarm = useCallback(async () => {
    await handleAlarmPermission().then(result => {
      setCheckedPermission(result);
    });
  }, []);

  const handleUpcomingMovie = useCallback(async () => {
    await handleUpcomingMovieSubscribe(checkedPermission, checkedUpcomingMovie)
      .then(result => {
        setCheckedUpcomingMovie(result);
      });
  }, [checkedPermission, checkedUpcomingMovie]);

  const handleNetflix = useCallback(async () => {
    await handleNetflixSubscribe(checkedPermission, checkedNetflix)
      .then(result => {
        setCheckedNetflix(result);
      });
  }, [checkedPermission, checkedNetflix]);

  const fetchData = useCallback(async () => {
    try {
      return await handleInitialSubscription();
    } catch (error) {
      console.error('An error occurred while checking token timestamps. ',
        error);
    }
  }, []);

  useEffect(() => {
    fetchData().then(result => {
      setCheckedPermission(result.permission);
      setCheckedUpcomingMovie(result.subscribe[0]);
      setCheckedNetflix(result.subscribe[1]);
    });
  }, [checkedPermission, checkedUpcomingMovie, checkedNetflix, fetchData]);

  return (<Container>
    <FormGroup sx={
      {
        mt: '20px',
        color: 'white',
        textAlign: 'center',
        mx: isMobile ? '300px' : '10px',
      }
    }>
      <ThemeProvider theme={theme}>
        {alarmPermissionSwitch}
        {upcomingSubscriptionSwitch}
        {netflixSubscriptionSwitch}
      </ThemeProvider>
    </FormGroup>
  </Container>);
}

