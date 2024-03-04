import React from 'react'
import { useState } from 'react'
import './Card.css'
import more from './more.png'
import { Link } from 'react-router-dom'
import { supabase } from '../client'


const Card = (props) =>  {

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0)

  const toggleLike = async () => {
    // Toggle the liked state
    const newLikedState = !liked;
    setLiked(newLikedState);

    // Calculate the new likes count based on whether the user is liking or unliking
    const newCount = newLikedState ? count + 1 : count - 1;
    setCount(newCount);

    // Update the likes in your database
    await supabase
      .from('Posts')
      .update({ likes: props.likes + newCount })
      .eq('id', props.id);
  };

  const makeFeatured = async (event) => {
    event.preventDefault();
  
    await supabase
      .from('Posts')
      .update({ featured : true})
      .eq('id', props.id)
  }

  return (
      <div className="Card">
        
        <div className="Card-header">
        <div className="Header-edit-button">
            <Link to={'/community/edit/:id'+ props.id}><img className="moreButton" alt="edit button" src={more} /></Link>
            </div>
          <div className="Card-header-content">
            <h2 className="title">{props.title}</h2>
            <h3 className="author">{"by " + props.author}</h3>
            <h3 className="author">{"Posted: " + props.date.slice(0, 10)}</h3>
            <p className="description">{props.description}</p>
          </div>
        </div>
        
        <a href={props.canvas} target="_blank" rel="noopener noreferrer">
          <img className="canvas" width = "400" height = "350" src={props.canvas} alt="canvas" style={{backgroundColor: 'white'}}/>
        </a>
        <div className="Button-Area">
        <button className="likeButton" onClick={toggleLike} >
          👍 Likes: {props.likes + count}
        </button>
          <button className="likeButton" onClick={makeFeatured} >⭐ Feature</button>
        </div>  
      </div>
  );
};

// Allows Admins to feature a post
// <button className="likeButton" onClick={makeFeatured} >⭐ Feature</button>

export default Card;