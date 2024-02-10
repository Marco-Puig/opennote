import './App.css';
import React from 'react';
import { useRoutes } from 'react-router-dom'
import ReadPosts from './pages/ReadPosts'
import ReadFeatures from './pages/ReadFeatures'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import { Link } from 'react-router-dom'


const App = () => {

  const posts = []
 

  // Sets up routes
  let element = useRoutes([
    {
      path: "/community",
      element:<ReadPosts data={posts}/>
    },
    {
      path:"/community/edit/:id",
      element: <EditPost data={posts} />
    },
    {
      path:"/new",
      element: <CreatePost />
    },
    {
      path:"/",
      element: <ReadFeatures />
    }
  ]);


  return ( 

    <div className="App">

      <div className="header">
        <h1>OpenNote 📝</h1>
        <Link to="/"><button className="headerBtn"> Featured ⭐</button></Link>
        <Link to="/community"><button className="headerBtn"> Community 🌐</button></Link>
        <Link to="/new"><button className="headerBtn"> Create a Post ✍️ </button></Link>
      </div>
        {element}
    </div>

  );
}

export default App;
