import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./EditPost.css";
import { supabase } from "../client";

const Comments = ({ data }) => {
  const { id } = useParams();
  const actualId = id.replace(":id", "");
  const [comment, setComment] = React.useState("");
  const [userData, setUserData] = React.useState(null);
  const [comments, setComments] = React.useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("Comments")
        .select("*")
        .eq("comment_id", actualId);

      if (error) {
        console.log("error", error);
      } else {
        setComments(data);
      }
    };
    fetchComments();
    fetchUserData();
  }, [actualId]);

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserData(user);
    }
  };

  const createComment = async (event) => {
    event.preventDefault();

    await supabase.from("Comments").insert([
      {
        user_id: userData.id,
        username: userData.user_metadata.display_name,
        comment_id: actualId,
        content: comment,
      },
    ]);

    window.location = this;
  };

  return (
    <div className="EditPost">
      <form onSubmit={createComment}>
        <label>Comment</label>
        <br />
        <input
          type="text"
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <div>
        {comments.map((comments) => (
          <div key={comments.id}>
            <h3>{comments.username}</h3>
            <h3>{comments.content}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
