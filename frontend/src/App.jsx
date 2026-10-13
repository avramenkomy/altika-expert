import {
  Route,
  Routes,
} from 'react-router';

import MainLayout from './layouts/MainLayout/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import ExpertisePage from './pages/ExpertisePage/ExpertisePage';
import ValuationPage from './pages/ValuationPage/ValuationPage';
import ServicePage from './pages/ServicePage/ServicePage';
import ExpertPage from './pages/ExpertPage/ExpertPage';


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

        <Route
          path="/services/:slug"
          element={<ServicePage />}
        />

        <Route
          path="/experts/:slug"
          element={<ExpertPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;