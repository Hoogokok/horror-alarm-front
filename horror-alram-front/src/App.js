import { BrowserRouter, } from 'react-router-dom'
import MainTabs from "./components/MainTab.jsx";
import { createGlobalStyle } from 'styled-components';


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
    </BrowserRouter>
  );
}

export default App;
