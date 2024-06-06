import { BrowserRouter, } from 'react-router-dom'
import MainTabs from "./components/MainTab.jsx";
import { createGlobalStyle } from 'styled-components';
import Footer from './components/Footer.jsx';
import getUpcomingMovies from './functions/upcoming.js';

const GlobalStyle = createGlobalStyle`
  body {
    background: #2F4F4F	;
  }
`;

const upcomingMovies = await getUpcomingMovies();

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <MainTabs 
        upcomingMovies={upcomingMovies}
      />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
