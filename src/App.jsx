import "./App.css";
import React, { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "./client";
import ReadPosts from "./pages/ReadPosts";
import ReadFeatures from "./pages/ReadFeatures";
import CreateAnimation from "./pages/CreateAnimation";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Drafts from "./pages/ReadDrafts";
import Comments from "./pages/Comments";
import Trending from "./pages/ReadTrending";

const App = () => {
  const [userData, setUserData] = useState(null);
  const posts = [];

  const handleSignout = async () => {
    await supabase.auth.signOut();
    setUserData(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        handleSignout();
      } else if (user) setUserData(user);
    };

    fetchUser();
  }, []);

  // Sets up routes
  let element = useRoutes([
    {
      path: "/opennote",
      element: <ReadFeatures />,
    },
    {
      path: "/opennote/trending",
      element: <Trending />,
    },
    {
      path: "/opennote/community",
      element: <ReadPosts data={posts} />,
    },
    {
      path: "/opennote/community/comments/:id",
      element: <Comments data={posts} />,
    },
    {
      path: "/opennote/new",
      element: <CreateAnimation />,
    },
    {
      path: "/opennote/signin",
      element: <SignIn />,
    },
    {
      path: "/opennote/signup",
      element: <SignUp />,
    },
    {
      path: "/opennote/profile",
      element: <Profile data={posts} />,
    },
    {
      path: "/opennote/drafts",
      element: <Drafts data={posts} />,
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
          <Link to="/opennote/trending">
            <button className="headerBtn"> Trending 📈 </button>
          </Link>
          <Link to="/opennote/community">
            <button className="headerBtn"> Community 🌐 </button>
          </Link>

          {userData ? (
            <Link to="/opennote/new">
              <button className="headerBtn"> Create Post ✍️ </button>
            </Link>
          ) : (
            <Link to="/opennote/signin">
              <button className="headerBtn"> Create Post ✍️ </button>
            </Link>
          )}
          {userData ? (
            <>
              <Link to="/opennote/drafts">
                <button className="headerBtn"> Drafts 📝 </button>
              </Link>
              <Link to="/opennote/profile">
                <button className="headerBtn"> Profile 👤 </button>
              </Link>
              <Link to="/opennote">
                <button className="headerBtn" onClick={handleSignout}>
                  Sign Out 🔴
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/opennote/signin">
                <button className="headerBtn"> Sign In 🔘 </button>
              </Link>
            </>
          )}
          <a href="https://ko-fi.com/marcopuig">
            <button className="headerBtn"> Donate ❤️</button>
          </a>
        </div>
      </div>
      {element}
    </div>
  );
};

export default App;
