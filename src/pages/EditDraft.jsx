import React from "react";
import "./EditPost.css";
import { supabase } from "../client";

const EditPost = (props) => {
  const deleteDraft = async (event) => {
    event.preventDefault();

    await supabase.from("Drafts").delete().eq("id", props.id);

    window.location = "/opennote/drafts";
  };

  return (
    <div className="EditDraft">
      <form>
        <button className="deleteButton" onClick={deleteDraft}>
          Delete Draft
        </button>
      </form>
    </div>
  );
};

export default EditPost;
