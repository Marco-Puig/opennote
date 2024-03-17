import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./EditPost.css";
import { supabase } from "../client";

const Comments = ({ data }) => {
  const { id } = useParams();
  const actualId = id.replace(":id", "");

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("Comments")
      .select("*")
      .eq("comment_id", actualId);

    if (error) {
      console.log("error", error);
    } else {
      console.log("data", data);
    }
  };

  const createComment = async (event) => {
    event.preventDefault();

    await supabase.from("Comments").insert([
      {
        comment_id: actualId,
        content: "This is a comment",
      },
    ]);

    window.location = this;
  };

  return (
    <div className="EditPost">
      <form>
        <label>Comments</label>
        <br />
        <Link to="/opennote/">
          <button className="backButton"> Back </button>
        </Link>
      </form>
    </div>
  );
};

export default Comments;
