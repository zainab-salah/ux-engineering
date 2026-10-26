import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import './styles.css';

// DummyJSON data never changes server-side, so cached reads stay fresh for the session.
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 1 } } });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}><App /><Toaster position="bottom-right" closeButton duration={6000} /></QueryClientProvider>
  </React.StrictMode>,
);
