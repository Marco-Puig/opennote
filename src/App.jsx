import "./App.css";
import React from "react";
import { useRoutes } from "react-router-dom";
import ReadPosts from "./pages/ReadPosts";
import ReadFeatures from "./pages/ReadFeatures";
import CreateAnimation from "./pages/CreateAnimation";
import EditPost from "./pages/EditPost";
import { Link } from "react-router-dom";

const App = () => {
  const posts = [];

  // Sets up routes
  let element = useRoutes([
    {
      path: "/opennote",
      element: <ReadFeatures />,
    },
    {
      path: "/opennote/community",
      element: <ReadPosts data={posts} />,
    },
    {
      path: "/opennote/community/edit/:id",
      element: <EditPost data={posts} />,
    },
    {
      path: "/opennote/new",
      element: <CreateAnimation />,
    },
  ]);

  return (
    <div className="App">
      <div className="header">
        <h1>OpenNote 📝</h1>
        <div className="nav_links">
          <Link to="/opennote">
            <button className="headerBtn"> Featured ⭐</button>
          </Link>
          <Link to="/opennote">
            <button className="headerBtn"> Trending 📈 </button>
          </Link>
          <Link to="/opennote/community">
            <button className="headerBtn"> Community 🌐 </button>
          </Link>
          <Link to="/opennote/new">
            <button className="headerBtn"> Create Post ✍️ </button>
          </Link>
          <a href="https://ko-fi.com/marcopuig">
            <button className="headerBtn"> Support Us ❤️</button>
          </a>
        </div>
      </div>
      {element}
    </div>
  );
};

export default App;
