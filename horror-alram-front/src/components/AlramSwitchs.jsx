import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import {
  handleAlarmPermission,
  handleUpcomingMovieSubscribe,
  handleNetflixSubscribe,
  handleInitialSubscription
} from "../functions/messaging";
import AlramSwitch from "./AlramSwitch"
import { useQuery, useMutation } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#BC8F8F',
    },
  },
});

export function AlramSwitchs() {
  const isMobile = useMediaQuery('(min-width:756px)');
  const { data: intialSubscription, isLoading: initialLoading, isError: initialError } = useQuery({
    queryKey: 'initialSubscription',
    queryFn: handleInitialSubscription,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 // 1시간
  });
  const [permission, setPermission] = useState(false)
  const [upcomingSub, setUpcomingSub] = useState(false)
  const [netflixSub, setNetflixSub] = useState(false)


  const alramMutation = useMutation({
    mutationFn: handleAlarmPermission,
    onSuccess: () => {
      setPermission(!permission)
    }
  })
  const upcomingMutation = useMutation({
    mutationFn: () => {
      handleUpcomingMovieSubscribe(permission, upcomingSub)
    },
    onSuccess: () => {
      setUpcomingSub(!upcomingSub)
    }
  })

  const netflixMutation = useMutation({
    mutationFn: () => {
      handleNetflixSubscribe(permission, netflixSub)
    },
    onSuccess: () => {
      setNetflixSub(!netflixSub)
    }
  })

  const onAlarmPermission = () => {
    alramMutation.mutate()
  }

  const onUpcomingMovieSubscribe = () => {
    upcomingMutation.mutate()
  }

  const onNetflixSubscribe = () => {
    netflixMutation.mutate()
  }

  if (initialLoading) {
    return <CircularProgress />
  }

  if (initialError) {
    return <div>서버 문제로 알람 초기화에 실패했습니다.</div>
  }

  if (alramMutation.isLoading || upcomingMutation.isLoading || netflixMutation.isLoading) {
    return <CircularProgress />
  }

  if (alramMutation.isError || upcomingMutation.isError || netflixMutation.isError) {
    return <div>알람 설정에 실패했습니다.</div>
  }

  if (intialSubscription.permission !== permission || intialSubscription.upcomingSub !== upcomingSub || intialSubscription.netflixSub !== netflixSub) {
    setPermission(intialSubscription.permission)
    setUpcomingSub(intialSubscription.upcomingSub)
    setNetflixSub(intialSubscription.netflixSub)
  }


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
        <AlramSwitch
          checked={permission}
          handleSwitch={onAlarmPermission}
          message={{ onMessage: '알람 설정이 활성화 되었습니다.', offMessage: '알람 설정이 비활성화 되었습니다.' }} />
        <AlramSwitch
          checked={upcomingSub}
          handleSwitch={onUpcomingMovieSubscribe}
          message={{ onMessage: '개봉 예정 영화 알람이 설정되었습니다.', offMessage: '개봉 예정 영화 알람이 해제되었습니다.' }} />
        <AlramSwitch
          checked={netflixSub}
          handleSwitch={onNetflixSubscribe}
          message={{ onMessage: '넷플릭스 영화 알람이 설정되었습니다.', offMessage: '넷플릭스 영화 알람이 해제되었습니다.' }}
        />
      </ThemeProvider>
    </FormGroup>
  </Container>);
}
