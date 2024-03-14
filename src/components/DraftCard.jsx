import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import more from "./more.png";
import { supabase } from "../client";
import CreateAnimation from "../pages/CreateAnimation";

const Card = (props) => {
  const [nameData, setNameData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setNameData(user.id);
  };

  const openDraft = async (event) => {
    event.preventDefault();
    // load the draft
    <CreateAnimation data={props.images} />;
  };

  return (
    <div className="Card">
      <div className="Card-header">
        <div className="Header-edit-button">
          <Link to={"/opennote/community/editdraft/:id" + props.id}>
            {props.author_id === nameData && (
              <img className="moreButton" alt="edit button" src={more} />
            )}
          </Link>
        </div>
        <div className="Card-header-content">
          <h2 className="title">
            {"Draft ID: " + props.date[20] + props.date[21]}
          </h2>
          <h3 className="author">{"by " + props.author}</h3>
          <h3 className="author">{"Posted: " + props.date.slice(0, 10)}</h3>
          <p className="description">{props.description}</p>
        </div>
      </div>
      <div className="Button-Area">
        <button className="likeButton" onClick={openDraft}>
          Open Draft 📝
        </button>
      </div>
    </div>
  );
};

export default Card;
