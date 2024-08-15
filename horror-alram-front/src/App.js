import { BrowserRouter, } from 'react-router-dom'
import MainTabs from "./components/MainTab.jsx";
import { createGlobalStyle } from 'styled-components';
import Footer from './components/Footer.tsx';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'

const GlobalStyle = createGlobalStyle`
  body {
    background: #2F4F4F	;
  }
`;
const queryClient = new QueryClient()
function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalStyle />
        <MainTabs/>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
