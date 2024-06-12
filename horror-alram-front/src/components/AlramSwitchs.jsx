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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';

const theme = createTheme({
  palette: {
    primary: {
      main: '#BC8F8F',
    },
  },
});

export function AlramSwitchs() {
  const isMobile = useMediaQuery('(min-width:756px)');
  const queryClient = useQueryClient()
  const { data: intialSubscription, isLoading: initialLoading, isError: initialError } = useQuery({
    queryKey: 'initialSubscription',
    queryFn: handleInitialSubscription,
  });

  const alramMutation = useMutation({
    mutationFn: handleAlarmPermission,
    onSuccess: () => {
      queryClient.invalidateQueries('initialSubscription')
    }
  })
  const upcomingMutation = useMutation({
    mutationFn: () => {
      handleUpcomingMovieSubscribe(intialSubscription?.permission, intialSubscription?.subscribe?.[0])
    },
    onSuccess: () => {
      queryClient.invalidateQueries('initialSubscription')
    }
  })

  const netflixMutation = useMutation({
    mutationFn: () => {
      handleNetflixSubscribe(intialSubscription?.permission, intialSubscription?.subscribe?.[1])
    },
    onSuccess: () => {
      queryClient.invalidateQueries('initialSubscription')
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

  const checkPermission = intialSubscription?.permission === 'granted'
  const checkUpcomingMovie = intialSubscription?.subscribe?.[0]
  const checkNetflix = intialSubscription?.subscribe?.[1]

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
     
      </ThemeProvider>
    </FormGroup>
  </Container>);
}
