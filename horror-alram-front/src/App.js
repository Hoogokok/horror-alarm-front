import { BrowserRouter, } from 'react-router-dom'
import MainTabs from "./components/MainTab.jsx";
import { createGlobalStyle } from 'styled-components';
import Footer from './components/Footer.jsx';
import getUpcomingMovies from './functions/upcoming.js';
import getExpiringMovies from './functions/expiring.js';
import getReleasingMovies from './functions/releasing.js';
import {
  handleInitialSubscription
} from "./functions/messaging.js";
const GlobalStyle = createGlobalStyle`
  body {
    background: #2F4F4F	;
  }
`;

const upcomingMovies = await getUpcomingMovies();
const expiringMovies = await getExpiringMovies();
const releasingMovies = await getReleasingMovies();
const intialSubscription = await handleInitialSubscription();

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <MainTabs 
        upcomingMovies={upcomingMovies}
        streamingMovies={expiringMovies}
        releasingMovies={releasingMovies}
        intialSubscription={intialSubscription}
      />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
