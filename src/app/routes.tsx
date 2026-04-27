import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { ResultsPage } from './components/ResultsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Profile } from './components/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Landing },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { 
        path: 'dashboard', 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      { 
        path: 'results', 
        element: (
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        )
      },
    ],
  },
]);