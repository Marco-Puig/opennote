import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import more from "./more.png";
import { supabase } from "../client";
import EditPost from "../pages/EditPost";

const Card = (props) => {
  const [count, setCount] = useState(0);
  const [nameData, setNameData] = useState(null);
  const [editing, setEditing] = useState(false);
  const audioRef = useRef(null);
  const gifRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    setCount(0);
  }, []);

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setNameData(user.id);
  };

  const toggleLike = async () => {
    // if user isnt logged in...
    if (!nameData) {
      alert("You must be logged in to like a post.");
      return;
    }

    // if user is logged in, if they liked the post, remove like, else add like
    const user_id = nameData;
    const post_id = props.id;

    const { data: existingLikes, error } = await supabase
      .from("Likes")
      .select("*")
      .eq("user_id", user_id)
      .eq("post_id", post_id);

    if (error) {
      console.error("Error checking for existing like", error);
      return;
    }

    if (existingLikes.length > 0) {
      await supabase
        .from("Likes")
        .delete()
        .match({ user_id: user_id, post_id: post_id });

      await supabase
        .from("Posts")
        .update({ likes: props.likes - 1 })
        .eq("id", props.id);

      setCount(count - 1);
    } else {
      await supabase
        .from("Likes")
        .insert([{ user_id: user_id, post_id: post_id }]);

      await supabase
        .from("Posts")
        .update({ likes: props.likes + 1 })
        .eq("id", props.id);

      setCount(count + 1);
    }
  };

  const makeFeatured = async (event) => {
    event.preventDefault();
    await supabase.from("Posts").update({ featured: true }).eq("id", props.id);
  };

  async function downloadImage(imageSrc, audioSrc) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "animation.gif";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (!audioSrc) return;

    const audio = await fetch(audioSrc);
    const audioBlog = await audio.blob();
    const audioURL = URL.createObjectURL(audioBlog);

    const audiolink = document.createElement("a");
    audiolink.href = audioURL;
    audiolink.download = "audio.mp3";
    document.body.appendChild(audiolink);
    audiolink.click();
    document.body.removeChild(audiolink);
  }

  const playAudio = () => {
    restartGif();
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.warn("Post does not contain audio:" + e));
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // Reset the audio to the start
      audioRef.current.currentTime = 0;
    }
  };
  useEffect(() => {
    // Initialize the audio element when the component mounts or when props.audio changes.
    audioRef.current = new Audio(props.audio);
    audioRef.current.volume = 0.5;

    return () => {
      // Cleanup audio element to avoid memory leaks
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [props.audio]);

  // Function to restart the GIF using useRef
  const restartGif = () => {
    const currentSrc = gifRef.current.src;
    gifRef.current.src = ""; // Force the image to unload
    gifRef.current.src = currentSrc; // Reset the src to force reload
  };

  const editPost = () => {
    setEditing(true);
  };

  return (
    <>
      {editing ? (
        <div>
          <div class="editing-header">
            <h3>Editing Post...</h3>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
          <EditPost
            id={props.id}
            title={props.title}
            description={props.description}
          ></EditPost>
        </div>
      ) : (
        <div className="Card" onMouseEnter={playAudio} onMouseLeave={stopAudio}>
          <div className="Card-header">
            <div className="Header-edit-button">
              {props.author_id === nameData && (
                <button
                  className="moreButton"
                  alt="edit button"
                  onClick={editPost}
                  src={more}
                  style={{
                    backgroundImage: `url(${more})`,
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    width: "30px",
                    height: "30px",
                    border: "none",
                    cursor: "pointer",
                  }}
                ></button>
              )}
            </div>
            <div className="Card-header-content">
              <h2 className="title">{props.title}</h2>
              {props.featured ? (
                <h3 className="tag-featured">Featured</h3>
              ) : null}
              <h3 className="author">{"by " + props.author}</h3>
              <h3 className="author">{"Posted: " + props.date.slice(0, 10)}</h3>
              <p className="description">{props.description}</p>
            </div>
          </div>
          <a href={props.canvas} target="_blank" rel="noopener noreferrer">
            <img
              ref={gifRef}
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
            {nameData === "9407454f-2697-47f5-8c32-1c8095d50fbd" && (
              <button className="likeButton" onClick={makeFeatured}>
                ⭐ Feature
              </button>
            )}
            <Link to={"/opennote/community/comments/:id" + props.id}>
              <button className="likeButton"> 💬 Comments </button>
            </Link>
            <button
              className="likeButton"
              onClick={() => downloadImage(props.canvas, props.audio)}
            >
              💾 Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
