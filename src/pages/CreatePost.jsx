import React, { useState, useRef, useEffect, useMemo } from 'react';
import './CreatePost.css';

import { supabase } from '../client'

const CreatePost = () => {

    const [post, setPost] = useState({title: "", author: "", description: "", canvas: ""})
    const canvasRef = useRef(null);
    const [currentColorIndex, setCurrentColorIndex] = useState(0); // Index to keep track of the current color

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
          .insert({title: post.title, author: post.author, description: post.description, canvas: canvasRef.current.toDataURL()})
          .select();
      
        window.location = "/";
    }
    
    const colors = useMemo(() => ['black', 'red', 'blue', 'green', 'yellow'], []); // Array of colors to cycle through

    useEffect(() => {
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let isDrawing = false;

        const startDrawing = (event) => {
            if (event.button === 2) {
                event.preventDefault(); // Prevent the right-click menu from opening
            }

            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            context.beginPath();
            context.moveTo(offsetX, offsetY);

            // Brush Color
            if (event.button === 0) {
                context.strokeStyle = colors[currentColorIndex];
            } else if (event.button === 2) {
            // Eraser
                context.strokeStyle = 'white';
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

        // Arrow keys to change color
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length); // Cycle forward through colors
            } else if (event.key === 'ArrowLeft') {
                setCurrentColorIndex((prevIndex) => (prevIndex - 1 + colors.length) % colors.length); // Cycle backward through colors
            }
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('contextmenu', event => event.preventDefault()); // Prevent the default context menu
        window.addEventListener('keydown', handleKeyDown); // Listen for keydown events on the window

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('contextmenu', event => event.preventDefault());
            window.removeEventListener('keydown', handleKeyDown); // Clean up the event listener
        };
    }, [currentColorIndex, colors]); // Add currentColorIndex and colors to the dependency array


    return (
        <div>
            <form>
                <label htmlFor="title">Title</label> <br />
                <input type="text" id="title" name="title" onChange={handleChange} /><br />
                <br/>

                <label htmlFor="author">Author</label><br />
                <input type="text" id="author" name="author" onChange={handleChange} /><br />
                <br/>

                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" onChange={handleChange}>
                </textarea>
                <br/>

                <label htmlFor="canvas">Draw</label><br />
                <canvas ref={canvasRef} id="canvas" name="canvas" width="500" height="500" style={{backgroundColor: 'white',  border: '5px solid', borderColor: colors[currentColorIndex] }} />
                <br/>

                <input type="submit" value="Create" onClick={createPost} />
            </form>
        </div>
    )
}

export default CreatePost