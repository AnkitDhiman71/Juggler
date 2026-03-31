import './index.css';
import './css/responsive.css';
import './css/home.css';
import './css/login.css';
import './css/signup.css';
import './css/dashboard.css';
import './css/tweets.css';
import './css/navbar.css';
import './style.css';
import './app.css';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

