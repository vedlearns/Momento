import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './app/App.tsx'
import { BrowserRouter } from 'react-router-dom'

import './styles/index.css';
import './styles/landing.css';
import './styles/home.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
