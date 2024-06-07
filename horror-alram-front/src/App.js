import { BrowserRouter, } from 'react-router-dom'
import MainTabs from "./components/MainTab.jsx";
import { createGlobalStyle } from 'styled-components';
import Footer from './components/Footer.jsx';
import getUpcomingMovies from './functions/upcoming.js';
import getExpiringMovies from './functions/expiring.js';
import getReleasingMovies from './functions/releasing.js';

const GlobalStyle = createGlobalStyle`
  body {
    background: #2F4F4F	;
  }
`;

const upcomingMovies = await getUpcomingMovies();
const expiringMovies = await getExpiringMovies();
const releasingMovies = await getReleasingMovies();

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <MainTabs 
        upcomingMovies={upcomingMovies}
        streamingMovies={expiringMovies}
        releasingMovies={releasingMovies}
      />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
