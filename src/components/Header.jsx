import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ isAuth, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="blog-header">
      <span className="blog-title" onClick={() => navigate("/")}>Realworld Blog</span>
      <div className="auth-buttons">
        {isAuth ? (
          <>
            <button className="create-article" onClick={() => navigate('/new-article')}>Create article</button>
            <span
              className="user-name clickable"
              onClick={() => navigate("/profile")}
            >
              {user?.username}
            </span>
            <img
              className="avatar clickable"
              src={user?.image || (user?.username ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}` : undefined)}
              alt="avatar"
              onClick={() => navigate("/profile")}
            />
            <button className="logout-btn" onClick={onLogout}>Log Out</button>
          </>
        ) : (
          <>
            <button className="sign-in" onClick={() => navigate("/sign-in")}>Sign In</button>
            <button className="sign-up" onClick={() => navigate("/sign-up")}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 