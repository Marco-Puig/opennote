import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EditPost.css'
import { supabase } from '../client'

const EditPost = ({data}) => {

    const {id} = useParams();
    const actualId = id.replace(":id", "");
    const [post, setPost] = useState({id: null, title: "", author: "", description: "", canvas: ""});
    const canvasRef = useRef(null);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setPost( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }

    const updatePost = async (event) => {
      event.preventDefault();
      
      await supabase
        .from('Posts')
        .update({ title: post.title, author: post.author, description: post.description, canvas: canvasRef.current.toDataURL()})
        .eq('id', actualId);
      
     window.location = "/community";
    }
    
    const deletePost = async (event) => {
      event.preventDefault();
      
      await supabase
        .from('Posts')
        .delete()
        .eq('id', actualId); 
      
      window.location = "http://localhost:3000/community";
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
    
        let isDrawing = false;
    
        const startDrawing = (event) => {
            // Prevent the right-click menu from opening
            if (event.button === 2) {
                event.preventDefault();
            }
    
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            context.beginPath();
            context.moveTo(offsetX, offsetY);
    
            // Set stroke color based on mouse button
            if (event.button === 2) { // Right mouse button
                context.strokeStyle = 'white'; // Set color to white for right-click
            } else if (event.button === 0) { // Left mouse button
                context.strokeStyle = 'black'; // Keep or set color to black for left-click
            }
        };
    
        const draw = (event) => {
            if (isDrawing) {
                const rect = canvas.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;
                context.lineTo(offsetX, offsetY);
                context.stroke();
            }
        };
    
        const stopDrawing = () => {
            if (isDrawing) {
                isDrawing = false;
                context.beginPath(); // Start a new path to prevent drawing a line on next mousedown
            }
        };
    
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('contextmenu', event => event.preventDefault()); // Prevent the default context menu
    
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('contextmenu', event => event.preventDefault());
        };
    }, []);
    

    return (
        <div>
            <form>
                <label for="title">Title</label> <br />
                <input type="text" id="title" name="title" value={post.title} onChange={handleChange} /><br />
                <br/>

                <label for="author">Author</label><br />
                <input type="text" id="author" name="author" value={post.author} onChange={handleChange} /><br />
                <br/>

                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" onChange={handleChange}>
                </textarea>
                <br/>

                <label htmlFor="canvas">Draw</label><br />
                <canvas ref={canvasRef} id="canvas" name="canvas" width="500" height="500" style={{backgroundColor: 'white'}} />
                <br/>

                <input type="submit" value="Update" onClick={updatePost}/>
                <button className="deleteButton" onClick={deletePost}>Delete</button>
            </form>
        </div>
    )
}

export default EditPost