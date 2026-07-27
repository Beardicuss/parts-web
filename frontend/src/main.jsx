import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import { LangProvider } from './i18n/LangContext.jsx';
import { AuthProvider } from './pages/admin/AuthContext.jsx';
import { ToastProvider } from './components/ToastContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import './styles/theme.css';

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <>
        <ScrollToTop />
        <App />
      </>
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  </React.StrictMode>
);
