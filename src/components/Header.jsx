import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ isAuth, user, onLogout }) => {
  const history = useHistory();

  return (
    <header className="blog-header">
      <span className="blog-title" onClick={() => history.push("/")}>Realworld Blog</span>
      <div className="auth-buttons">
        {isAuth ? (
          <>
            <button className="create-article" onClick={() => history.push('/new-article')}>Create article</button>
            <span
              className="user-name clickable"
              onClick={() => history.push("/profile")}
            >
              {user?.username}
            </span>
            <img
              className="avatar clickable"
              src={user?.image || (user?.username ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}` : undefined)}
              alt="avatar"
              onClick={() => history.push("/profile")}
            />
            <button className="logout-btn" onClick={onLogout}>Log Out</button>
          </>
        ) : (
          <>
            <button className="sign-in" onClick={() => history.push("/sign-in")}>Sign In</button>
            <button className="sign-up" onClick={() => history.push("/sign-up")}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 