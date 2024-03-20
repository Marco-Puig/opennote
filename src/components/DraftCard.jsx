import React, { useState, useEffect } from "react";
import "./Card.css";
import more from "./more.png";
import { supabase } from "../client";
import CreateAnimation from "../pages/CreateAnimation";
import EditDraft from "../pages/EditDraft";

const DraftCard = (props) => {
  const [nameData, setNameData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);

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
    setOpen(true);
  };

  const editPost = () => {
    setEditing(true);
  };

  return (
    <>
      {editing ? (
        <div>
          <div class="editing-header">
            <h3>Draft Settings</h3>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
          <EditDraft id={props.id}></EditDraft>
        </div>
      ) : (
        <div>
          {open && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ marginRight: "400px" }}>Editing Draft...</h3>
                <button className="headerBtn" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
              <CreateAnimation images={props.images} />
            </>
          )}
        </div>
      )}
      {!open && !editing && (
        <div className="Card">
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
              <h2 className="title">
                {"Draft ID: " + props.date[20] + props.date[21]}
              </h2>
              <h3 className="author">{"by " + props.author}</h3>
              <h3 className="author">{"Saved: " + props.date.slice(0, 10)}</h3>
            </div>
          </div>
          <div>
            <img
              className="canvas"
              width="400"
              height="350"
              src={props.images[0]}
              alt="draft"
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div className="Button-Area">
            <button className="likeButton" onClick={openDraft}>
              Open Draft 📝
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DraftCard;
