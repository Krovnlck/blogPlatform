import React from "react";
import ArticleList from "../features/ArticleList";

const HomePage = ({ user, isAuth }) => {
  return (
    <div>
      <ArticleList user={user} isAuth={isAuth} />
    </div>
  );
};

export default HomePage; 