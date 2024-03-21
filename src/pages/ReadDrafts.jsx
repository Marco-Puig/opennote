import React, { useState, useEffect } from "react";
import DraftCard from "../components/DraftCard";
import { supabase } from "../client";
import "../components/Card.css";

const ReadDrafts = (props) => {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts(props.data);
    fetchUserData();
  }, [props]);

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserData(user);
      const { data, error } = await supabase
        .from("Drafts")
        .select("*")
        .order("created_at", { ascending: false })
        .filter("author_id", "eq", user.id);

      if (error) {
        console.error("error fetching posts", error);
      } else {
        setPosts(data);
      }
    } else {
      window.location.href = "/signin";
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <h2 className="posts">Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="profile">
        <h2 className="posts">
          {userData
            ? `${userData.user_metadata.display_name}'s Drafts`
            : "Failed to load Profile"}
        </h2>
        <div className="ReadPosts">
          {posts &&
            posts.length > 0 &&
            posts.map((post, index) => (
              <DraftCard
                key={index}
                id={post.id}
                title={post.title}
                author={userData.user_metadata.display_name}
                date={post.created_at}
                description={post.description}
                featured={post.featured}
                author_id={post.author_id}
                images={post.images}
              />
            ))}
          {posts && posts.length === 0 && (
            <h2 className="posts">No drafts found</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default ReadDrafts;
