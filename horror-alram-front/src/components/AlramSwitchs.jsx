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

const theme = createTheme({
  palette: {
    primary: {
      main: '#BC8F8F',
    },
  },
});

export function AlramSwitchs({ intialSubscription, alarmPermissionSwitch, upcomingSubscriptionSwitch, netflixSubscriptionSwitch }) {
  const isMobile = useMediaQuery('(min-width:756px)');
  const queryClient = useQueryClient()
  const { data: intialSubscription, isLoading: initialLoading, isError: initialError } = useQuery({
    queryKey: 'initialSubscription',
    queryFn: handleInitialSubscription,
  });


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
