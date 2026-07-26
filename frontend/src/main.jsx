import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { LangProvider } from './i18n/LangContext.jsx';
import { AuthProvider } from './pages/admin/AuthContext.jsx';
import { ToastProvider } from './components/ToastContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
