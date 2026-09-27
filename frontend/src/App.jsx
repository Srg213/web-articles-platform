import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import Nav from './components/Nav.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Read from './pages/Read.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Submit from './pages/Submit.jsx';
import MySubmissions from './pages/MySubmissions.jsx';
import EditorDesk from './pages/EditorDesk.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Read />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={<ProtectedRoute><Submit /></ProtectedRoute>} />
          <Route path="/mine" element={<ProtectedRoute><MySubmissions /></ProtectedRoute>} />
          <Route path="/editor" element={<ProtectedRoute roles={['editor','admin']}><EditorDesk /></ProtectedRoute>} />
        </Routes>
      </main>
    </AuthProvider>
  );
}
