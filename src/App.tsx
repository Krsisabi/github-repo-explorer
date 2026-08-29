import { Route, Routes } from 'react-router-dom';

import { REPO_PAGE_ROUTE } from './constants/routes';
import { Container } from './components/Container';
import { Header } from './components/Header';
import { Main } from './pages/Main';
import { Repo } from './pages/Repo';
import { Error } from './pages/Error';

function App() {
  return (
    <Container>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path={REPO_PAGE_ROUTE} element={<Repo />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Container>
  );
}

export default App;
