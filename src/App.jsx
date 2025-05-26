import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
// import ArticleList from './components/ArticleList';
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
      <Switch>
        <Route path="/sign-in" render={() => <SignInForm onLogin={handleLogin} />} />
        <Route path="/sign-up" render={() => <SignUpForm onRegister={handleLogin} />} />
        <PrivateRoute path="/new-article" isAuth={isAuth}>
          <NewArticlePage user={user} />
        </PrivateRoute>
        <PrivateRoute path="/articles/:slug/edit" isAuth={isAuth}>
          <EditArticlePage user={user} />
        </PrivateRoute>
        <Route path="/articles/:slug" render={() => <ArticlePage user={user} isAuth={isAuth} />} />
        <Route path="/profile" render={() => <ProfilePage user={user} onUserUpdate={setUser} />} />
        <Route path="/" render={() => <HomePage user={user} isAuth={isAuth} />} exact />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
