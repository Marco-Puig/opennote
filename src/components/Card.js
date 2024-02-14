import React from 'react'
import { useState } from 'react'
import './Card.css'
import more from './more.png'
import { Link } from 'react-router-dom'
import { supabase } from '../client'


const Card = (props) =>  {

  const [count, setCount] = useState(0)

  const updateCount = async (event) => {
    event.preventDefault();
  
    await supabase
      .from('Posts')
      .update({ likes : props.likes + count + 1})
      .eq('id', props.id)
  
    setCount((count) => count + 1);
  }

  const makeFeatured = async (event) => {
    event.preventDefault();
  
    await supabase
      .from('Posts')
      .update({ featured : true})
      .eq('id', props.id)
  }

  return (
      <div className="Card">
          <Link to={'/community/edit/:id'+ props.id}><img className="moreButton" alt="edit button" src={more} /></Link>
          <h2 className="title">{props.title}</h2>
          <h3 className="author">{"by " + props.author}</h3>
          <p className="description">{props.description}</p>
          <img className="canvas" width = "300" height = "300" src={props.canvas} alt="canvas" style={{backgroundColor: 'white'}}/>
          <button className="likeButton" onClick={updateCount} >👍 Likes: {props.likes + count}</button>
          <button className="likeButton" onClick={makeFeatured} >⭐ Feature</button>
      </div>
  );
};

// Allows Admins to feature a post
// <button className="likeButton" onClick={makeFeatured} >⭐ Feature</button>

export default Card;