import {
  Route,
  Routes,
} from 'react-router';

import MainLayout from './layouts/MainLayout/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import ExpertisePage from './pages/ExpertisePage/ExpertisePage';
import ValuationPage from './pages/ValuationPage/ValuationPage';


function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/expertises/:slug"
          element={<ExpertisePage />}
        />

        <Route
          path="/valuation/:slug"
          element={<ValuationPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;