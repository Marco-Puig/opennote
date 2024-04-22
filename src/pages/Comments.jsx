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
  const [loading, setLoading] = React.useState(true);
  const [postData, setPostData] = React.useState([]);

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
      setLoading(false);
    };
    fetchComments();
    fetchUserData();
    const fetchPostData = async () => {
      const { data, error } = await supabase
        .from("Posts")
        .select("*")
        .eq("id", actualId);

      if (error) {
        console.log("error", error);
      } else {
        setPostData(data);
      }
    };
    fetchPostData();
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

    if (!userData) {
      alert("Please sign in to comment");
      return;
    }

    await supabase.from("Comments").insert([
      {
        user_id: userData.id,
        username: userData.user_metadata.display_name,
        comment_id: actualId,
        content: comment,
      },
    ]);

    window.location = "/community/comments/:id" + actualId;
  };

  return (
    <div className="EditPost">
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <div className="post-info">
            <label>Post Info</label>
            <h4>{postData[0] ? "Post Title: " + postData[0].title : ""}</h4>
            <h4>{postData[0] ? "Post Author: " + postData[0].author : ""}</h4>
            <h4>
              {postData[0]
                ? "Post Time: " + postData[0].created_at.slice(11)
                : ""}
            </h4>
          </div>
          <form onSubmit={createComment}>
            <label>Comment</label>
            <br />
            <input
              type="text"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-input"
            />
            <br />
            <button type="submit">Post</button>
          </form>
          <div className="comments">
            {comments[0] ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment-box">
                  <h3>{comment.username}</h3>
                  <h3>{comment.content}</h3>
                </div>
              ))
            ) : (
              <h3>No comments... be the first!</h3>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
