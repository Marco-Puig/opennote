import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./EditPost.css";
import { supabase } from "../client";

const EditPost = ({ data }) => {
  const { id } = useParams();
  const actualId = id.replace(":id", "");

  const deleteDraft = async (event) => {
    event.preventDefault();

    await supabase.from("Drafts").delete().eq("id", actualId);

    window.location = "/opennote/";
  };

  return (
    <div className="EditDraft">
      <form>
        <label>Draft Settings</label>
        <br />
        <button className="deleteButton" onClick={deleteDraft}>
          Delete Draft
        </button>
        <Link to="/opennote/drafts">
          <button className="backButton"> Back </button>
        </Link>
      </form>
    </div>
  );
};

export default EditPost;
