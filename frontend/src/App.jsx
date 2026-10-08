import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';

import api from './api/api';

function HomePage() {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const response = await api.get('/company/');
        setCompany(response.data);
      } catch {
        setError("Не удалось загрузить данные компании.");
      }
    };

    loadCompany();
  }, []);

  if (error) {
    return <p>{error}</p>
  }

  if (!company) {
    return <p>Loading...</p>
  }

  return (
    <main>
      <h1>{company.name}</h1>
      <p>{company.description}</p>
    </main>
  )
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App;
