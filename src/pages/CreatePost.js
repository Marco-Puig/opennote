import React, { useState } from 'react';
import './CreatePost.css';

import { supabase } from '../client'

const CreatePost = () => {

    const [post, setPost] = useState({title: "", author: "", description: ""})

    const handleChange = (event) => {
        const {name, value} = event.target;
        setPost( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    const createPost = async (event) => {
        event.preventDefault();
      
        await supabase
          .from('Posts')
          .insert({title: post.title, author: post.author, description: post.description})
          .select();
      
        window.location = "/";
      }

    return (
        <div>
            <form>
                <label for="title">Title</label> <br />
                <input type="text" id="title" name="title" onChange={handleChange} /><br />
                <br/>

                <label for="author">Author</label><br />
                <input type="text" id="author" name="author" onChange={handleChange} /><br />
                <br/>

                <label for="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" onChange={handleChange}>
                </textarea>
                <br/>
                <input type="submit" value="Create" onClick={createPost} />
            </form>
        </div>
    )
}

export default CreatePost