import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#BC8F8F',
    },
  },
});

export function AlramSwitchs({ alarmPermissionSwitch, upcomingSubscriptionSwitch, netflixSubscriptionSwitch }) {
  const isMobile = useMediaQuery('(min-width:756px)');

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
