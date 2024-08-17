import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import { createTheme } from '@mui/material/styles';
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
  const { data: intialSubscription =
    { permission: 'default', subscribe: [false, false], error: '' }
    , isLoading: initialLoading, isError: initialError } = useQuery({
      queryKey: ['initialSubscription'],
      queryFn: handleInitialSubscription
    });
  const [permissionAlram, setPermissionAlram] = useState("default")
  const [upcomingSub, setUpcomingSub] = useState(false)
  const [netflixSub, setNetflixSub] = useState(false)


  const alramMutation = useMutation({
    mutationFn: handleAlarmPermission,
    onSuccess: () => {
      const current = permissionAlram === 'default' ? 'granted' : 'default'
      setPermissionAlram(current)
      if (intialSubscription) {
        intialSubscription.permission = current
      }
    }
  })
  const upcomingMutation = useMutation({
    mutationFn: async () => {
      await handleUpcomingMovieSubscribe(permissionAlram === 'granted', upcomingSub)
    },
    onSuccess: () => {
      const current = !upcomingSub
      setUpcomingSub(current)
      if (intialSubscription) {
        intialSubscription.subscribe[0] = current
      }
    }
  })

  const netflixMutation = useMutation({
    mutationFn: async () => {
      await handleNetflixSubscribe(permissionAlram === 'granted', netflixSub)
    },
    onSuccess: () => {
      const current = !netflixSub
      setNetflixSub(current)
      if (intialSubscription) {
        intialSubscription.subscribe[1] = current
      }
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

  if (alramMutation.isPending || upcomingMutation.isPending || netflixMutation.isPending) {
    return <CircularProgress />
  }

  if (alramMutation.isError || upcomingMutation.isError || netflixMutation.isError) {
    return <div>알람 설정에 실패했습니다.</div>
  }

  const { permission, subscribe, error } = intialSubscription
  if (error) {
    return <div>{error}</div>
  }
  const [permissionResult, upcomingSubResult, netflixSubResult] = [permission, subscribe[0], subscribe[1]]

  if (permissionResult !== permissionAlram) {
    setPermissionAlram(permissionResult)
  }

  if (upcomingSubResult !== upcomingSub) {
    setUpcomingSub(upcomingSubResult)
  }

  if (netflixSubResult !== netflixSub) {
    setNetflixSub(netflixSubResult)
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
      <AlramSwitch
        checked={permissionAlram === 'granted'}
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
    </FormGroup>
  </Container>);
}
