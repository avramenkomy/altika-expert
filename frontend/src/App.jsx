import {
  Route,
  Routes,
} from 'react-router';

import MainLayout from './layouts/MainLayout/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import ExpertisePage from './pages/ExpertisePage/ExpertisePage';


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
      </Route>
    </Routes>
  );
}

export default App;