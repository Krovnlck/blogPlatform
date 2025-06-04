import { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import ReactMarkdown from 'react-markdown';
import Header from './components/Header';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';
import NewArticlePage from './pages/NewArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import ArticlePage from './pages/ArticlePage';
import { useGetCurrentUserQuery } from './features/authApi';

function App() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const token = localStorage.getItem('token');
  const { data, isLoading } = useGetCurrentUserQuery(token, { skip: !token });

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
      setIsAuth(true);
    }
  }, [data]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuth(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <Header isAuth={isAuth} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/sign-in" element={<SignInForm onLogin={handleLogin} />} />
        <Route path="/sign-up" element={<SignUpForm onRegister={handleLogin} />} />
        <Route path="/new-article" element={
          <PrivateRoute isAuth={isAuth}>
          <NewArticlePage user={user} />
        </PrivateRoute>
        } />
        <Route path="/articles/:slug/edit" element={
          <PrivateRoute isAuth={isAuth}>
          <EditArticlePage user={user} />
        </PrivateRoute>
        } />
        <Route path="/articles/:slug" element={<ArticlePage user={user} isAuth={isAuth} />} />
        <Route path="/profile" element={<ProfilePage user={user} onUserUpdate={setUser} />} />
        <Route path="/" element={<HomePage user={user} isAuth={isAuth} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
