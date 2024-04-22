import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { supabase } from "../client";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("Posts")
      .select()
      .order("created_at", { ascending: false });
    setPosts(data);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ReadPosts">
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px" }}
      />
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post, index) => (
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
            audio={post.audio}
          />
        ))
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default Search;
