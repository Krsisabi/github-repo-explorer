import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './styles/index.css';
import store from './store/store';

const container = document.getElementById('root');

if (!container) {
  throw new Error('index.html is missing the #root element');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
