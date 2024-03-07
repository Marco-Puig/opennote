import React, { useEffect } from "react";
import { useState } from "react";
import "./Card.css";
import more from "./more.png";
import { Link } from "react-router-dom";
import { supabase } from "../client";

const Card = (props) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [nameData, setNameData] = useState(null);

  useEffect(() => {
    // checkLiked();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setNameData(user.user_metadata.display_name);
  };

  const toggleLike = async () => {
    // Toggle the liked state
    const newLikedState = !liked;
    setLiked(newLikedState);

    // Calculate the new likes count based on whether the user is liking or unliking
    const newCount = newLikedState ? count + 1 : count - 1;
    setCount(newCount);

    // Update the likes in your database
    await supabase
      .from("Posts")
      .update({ likes: props.likes + newCount })
      .eq("id", props.id);
  };

  const makeFeatured = async (event) => {
    event.preventDefault();
    await supabase.from("Posts").update({ featured: true }).eq("id", props.id);
  };

  async function downloadImage(imageSrc) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "animation.gif";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="Card">
      <div className="Card-header">
        <div className="Header-edit-button">
          <Link to={"/opennote/community/edit/:id" + props.id}>
            {props.author === nameData && (
              <img className="moreButton" alt="edit button" src={more} />
            )}
          </Link>
        </div>
        <div className="Card-header-content">
          <h2 className="title">{props.title}</h2>
          {props.featured ? <h3 className="tag-featured">Featured</h3> : null}
          <h3 className="author">{"by " + props.author}</h3>
          <h3 className="author">{"Posted: " + props.date.slice(0, 10)}</h3>
          <p className="description">{props.description}</p>
        </div>
      </div>

      <a href={props.canvas} target="_blank" rel="noopener noreferrer">
        <img
          className="canvas"
          width="400"
          height="350"
          src={props.canvas}
          alt="canvas"
          style={{ backgroundColor: "white" }}
        />
      </a>
      <div className="Button-Area">
        <button className="likeButton" onClick={toggleLike}>
          👍 Likes: {props.likes + count}
        </button>
        {/* Allows Admins to feature a post */}
        {/*  <button className="likeButton" onClick={makeFeatured}>
          ⭐ Feature
        </button> */}
        <button
          className="likeButton"
          onClick={() => downloadImage(props.canvas)}
        >
          💾 Save
        </button>
      </div>
    </div>
  );
};

export default Card;