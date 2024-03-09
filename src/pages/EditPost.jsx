import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./EditPost.css";
import { supabase } from "../client";

const EditPost = ({ data }) => {
  const { id } = useParams();
  const actualId = id.replace(":id", "");
  const [post, setPost] = useState({
    id: null,
    title: "",
    author: "",
    description: "",
    canvas: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const updatePost = async (event) => {
    event.preventDefault();

    await supabase
      .from("Posts")
      .update({
        title: post.title,
        description: post.description,
      })
      .eq("id", actualId);

    window.location = "/opennote/community/";
  };

  const deletePost = async (event) => {
    event.preventDefault();

    await supabase.from("Posts").delete().eq("id", actualId);

    window.location = "/opennote/community/";
  };

  return (
    <div>
      <form onSubmit={updatePost}>
        <label for="title">Title</label> <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          value={post.title}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="description">Description</label>
        <br />
        <textarea
          rows="5"
          cols="50"
          id="description"
          name="description"
          required
          value={post.description}
          onChange={handleChange}
        ></textarea>
        <br />
        <input type="submit" value="Update" />
        <button className="deleteButton" onClick={deletePost}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditPost;
