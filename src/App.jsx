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
import Search from "./pages/Search";

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
      path: "/",
      element: <ReadFeatures />,
    },
    {
      path: "/trending",
      element: <Trending />,
    },
    {
      path: "/community",
      element: <ReadPosts data={posts} />,
    },
    {
      path: "/community/comments/:id",
      element: <Comments data={posts} />,
    },
    {
      path: "/new",
      element: <CreateAnimation />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/profile",
      element: <Profile data={posts} />,
    },
    {
      path: "/drafts",
      element: <Drafts data={posts} />,
    },
    {
      path: "/search",
      element: <Search data={posts} />,
    },
  ]);

  return (
    <div className="App">
      <div className="header">
        <h1>OpenNote 📝</h1>
        <div className="nav_links">
          <Link to="">
            <button className="headerBtn"> Featured ⭐</button>
          </Link>
          <Link to="/trending">
            <button className="headerBtn"> Top Liked 📈 </button>
          </Link>
          <Link to="/community">
            <button className="headerBtn"> Community 🌐 </button>
          </Link>
          <Link to="/search">
            <button className="headerBtn"> Search 🔍 </button>
          </Link>
          {userData ? (
            <Link to="/new">
              <button className="headerBtn"> Create Post ✍️ </button>
            </Link>
          ) : (
            <Link to="/signin">
              <button className="headerBtn"> Create Post ✍️ </button>
            </Link>
          )}
          {userData ? (
            <>
              <Link to="/drafts">
                <button className="headerBtn"> Drafts 📝 </button>
              </Link>
              <Link to="/profile">
                <button className="headerBtn"> Profile 👤 </button>
              </Link>
              <Link to="">
                <button className="headerBtn" onClick={handleSignout}>
                  Sign Out 🔴
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin">
                <button className="headerBtn"> Sign In 🔘 </button>
              </Link>
            </>
          )}
          {/*<a href="https://ko-fi.com/marcopuig">
            <button className="headerBtn"> Donate ❤️</button>
          </a> */}
        </div>
      </div>
      {element}
    </div>
  );
};

export default App;
