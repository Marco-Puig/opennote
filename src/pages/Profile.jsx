import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { supabase } from "../client";
import "../components/Card.css";

const Profile = (props) => {
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
        .from("Posts")
        .select("*")
        .order("created_at", { ascending: false })
        .filter("author_id", "eq", user.id);

      if (error) {
        console.error("error fetching posts", error);
      } else {
        setPosts(data);
      }
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
            ? `${userData.user_metadata.display_name}'s Profile`
            : "Failed to load Profile"}
        </h2>
        <div className="ReadPosts">
          {posts &&
            posts.length > 0 &&
            posts.map((post, index) => (
              <Card
                key={index}
                id={post.id}
                title={post.title}
                author={post.author}
                date={post.created_at}
                description={post.description}
                likes={post.likes}
                canvas={post.canvas}
                featured={post.featured}
                author_id={post.author_id}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
