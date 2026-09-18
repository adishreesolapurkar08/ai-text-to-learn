import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AppProvider } from './components/ui/provider';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="courses/:courseId" element={<CoursePage />} />
                <Route
                  path="courses/:courseId/module/:moduleIndex/lesson/:lessonIndex"
                  element={<LessonPage />}
                />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AppProvider>
    </AuthProvider>
  </StrictMode>
);
