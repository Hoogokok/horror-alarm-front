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

const theme = createTheme({
  palette: {
    primary: {
      main: '#BC8F8F',
    },
  },
});

const LabelText = styled('span')({
  color: 'white', // 원하는 색깔로 변경
});


export function PermissionSwitch() {
  const [checkedPermission, setCheckedPermission] = useState(false);
  const [checkedUpcomingMovie, setCheckedUpcomingMovie] = useState(false);
  const [checkedNetflix, setCheckedNetflix] = useState(false);

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
    <FormGroup>
      <ThemeProvider theme={theme}>
        <AlarmPermissionSwitch checkedPermission={checkedPermission}
          handleAlarmPermission={handleAlarm} />
        <UpcomingSubscriptionSwitch checkedUpcomingMovie={checkedUpcomingMovie}
          handleUpcomingMovieSubscribe={handleUpcomingMovie} />
        <NetflixSubscriptionSwitch checkedNetflix={checkedNetflix}
          handleNetflixSubscribe={handleNetflix} />
      </ThemeProvider>
    </FormGroup>
  </Container>);
}

const AlarmPermissionSwitch = memo(function AlarmPermissionSwitch({
  checkedPermission, handleAlarmPermission
}) {
  return (<FormControlLabel control={<Switch
    checked={checkedPermission}
    onChange={handleAlarmPermission}
    inputProps={{ 'aria-label': 'controlled' }}
  />} label=
    {checkedPermission ? <LabelText>알람 권한 허용 중</LabelText> :
      <LabelText>알람 권한 허용하기</LabelText>}
  />)
});

const UpcomingSubscriptionSwitch = memo(function UpcomingSubscriptionSwitch({
  checkedUpcomingMovie, handleUpcomingMovieSubscribe
}) {
  return (<FormControlLabel control={<Switch
    checked={checkedUpcomingMovie}
    onChange={handleUpcomingMovieSubscribe}
    inputProps={{ 'aria-label': 'controlled' }}
  />} label={checkedUpcomingMovie ? <LabelText>
    개봉 예정 영화 알림 중
  </LabelText> :
    <LabelText>개봉 예정 영화 알림 켜기</LabelText>}
  />)
});

const NetflixSubscriptionSwitch = memo(function NetflixSubscriptionSwitch({
  checkedNetflix, handleNetflixSubscribe
}) {
  return (<FormControlLabel control={<Switch
    checked={checkedNetflix}
    onChange={handleNetflixSubscribe}
    inputProps={{ 'aria-label': 'controlled' }}
  />}
    label={checkedNetflix ? <LabelText>
      넷플릭스 만료 알림 중
    </LabelText> : <LabelText>넷플릭스 만료 알림 켜기</LabelText>}
  />)
});
