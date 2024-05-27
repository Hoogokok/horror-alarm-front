import { BrowserRouter, } from 'react-router-dom'
import MainTabs from "./components/MainTab.jsx";
import { createGlobalStyle } from 'styled-components';
import Footer from './components/Footer.jsx';


const GlobalStyle = createGlobalStyle`
  body {
    background: #2F4F4F	;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <MainTabs />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
