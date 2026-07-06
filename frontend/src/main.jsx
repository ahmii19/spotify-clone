import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import './styles/index.css';

function ToastWrapper() {
  const [toastStyles, setToastStyles] = useState(() => {
    const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    return {
      background: isDark ? '#282828' : '#ffffff',
      color: isDark ? '#fff' : '#111827',
      border: isDark ? '1px solid #404040' : '1px solid #e5e5e5',
    };
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
      setToastStyles({
        background: isDark ? '#282828' : '#ffffff',
        color: isDark ? '#fff' : '#111827',
        border: isDark ? '1px solid #404040' : '1px solid #e5e5e5',
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{ duration: 3000, style: toastStyles }}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
          <ToastWrapper />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
