import { useState } from 'react';

import { useSearchRepoQuery } from './services/api';

function App() {
  const [searchValue, setSearchValue] = useState('');

  const { data, isLoading, error } = useSearchRepoQuery({ name: searchValue });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error : {(error as Error).message}</p>;

  return (
    <div>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div style={{ color: 'white' }}>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
}

export default App;
