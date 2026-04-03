import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { boot } from './lib/seed';
import './styles.css';

boot();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
