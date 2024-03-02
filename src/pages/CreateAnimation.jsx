import React, { useState, useRef, useEffect } from 'react';
import './CreatePost.css';
import GifEncoder from 'gif-encoder-2';
import { supabase } from '../client';
import { Buffer } from 'buffer';


const CreateAnimation = () => {
    const [post, setPost] = useState({ title: "", author: "", description: "", canvases: [] });
    const canvasRefs = useRef([]);

    const [gifUrl, setGifUrl] = useState('');

    window.Buffer = Buffer;

    // This useEffect ensures that canvasRefs.current always has the same length as post.canvases
    useEffect(() => {
        canvasRefs.current = canvasRefs.current.slice(0, post.canvases.length);
    }, [post.canvases.length]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const createGIF = async () => {
        if (post.canvases.length === 0) {
            alert("Please add at least one frame.");
            return;
        }
    
        const width = 500;
        const height = 500;
    
        const gif = new GifEncoder(width, height);
        gif.setDelay(500); // Adjust delay as needed
        gif.start();
    
        for (const canvas of canvasRefs.current) {
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
                // Change transparent background to white
                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i + 3] === 0) { // If pixel is fully transparent
                        imageData.data[i] = 255;     // Set red component to 255
                        imageData.data[i + 1] = 255; // Set green component to 255
                        imageData.data[i + 2] = 255; // Set blue component to 255
                        imageData.data[i + 3] = 255; // Make pixel fully opaque
                    }
                }
    
                // Put the modified imageData back to the canvas
                ctx.putImageData(imageData, 0, 0);
    
                // Add frame to GIF
                gif.addFrame(ctx);
            }
        }
    
        gif.finish();
    
        // Create a blob from the GIF data
        const blob = new Blob([gif.out.getData()], { type: 'image/gif' });
        
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Set the display for the GIF
        console.log('GIF created successfully. URL:', url);
        setGifUrl(url);
    };
    
    const createPost = async (event) => {
        event.preventDefault();
        createGIF();
    };

    const addCanvas = () => {
        setPost((prev) => ({
            ...prev,
            canvases: [...prev.canvases, null],
        }));
    };

    const removeCanvas = () => {
        setPost((prev) => ({
            ...prev,
            canvases: prev.canvases.slice(0, -1),
        }));
    };

    // Handle drawing on canvases
    useEffect(() => {
        post.canvases.forEach((_, index) => {
            const canvas = canvasRefs.current[index];
            if (canvas) {
                const context = canvas.getContext('2d');

                let isDrawing = false;
    
                const startDrawing = (event) => {
                    if (event.button === 2) {
                        event.preventDefault();
                    }
    
                    isDrawing = true;
                    const rect = canvas.getBoundingClientRect();
                    const offsetX = event.clientX - rect.left;
                    const offsetY = event.clientY - rect.top;
                    context.beginPath();
                    context.moveTo(offsetX, offsetY);
    
                    if (event.button === 2) {
                        context.strokeStyle = 'white';
                    } else if (event.button === 0) {
                        context.strokeStyle = 'black';
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
                        context.beginPath();
                    }
                };
    
                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', draw);
                canvas.addEventListener('mouseup', stopDrawing);
                canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    
                return () => {
                    canvas.removeEventListener('mousedown', startDrawing);
                    canvas.removeEventListener('mousemove', draw);
                    canvas.removeEventListener('mouseup', stopDrawing);
                    canvas.removeEventListener('contextmenu', (event) => event.preventDefault());
                };
            }
        });
    }, [post.canvases]);

    return (
        <div className="create-animation">
            <form onSubmit={createPost}>
                <div className="form-group">
                    <label htmlFor="title">Title</label> <br />
                    <input type="text" id="title" name="title" value={post.title} onChange={handleChange} /><br />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author</label><br />
                    <input type="text" id="author" name="author" value={post.author} onChange={handleChange} /><br />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label><br />
                    <textarea id="description" name="description" rows="5" cols="50" value={post.description} onChange={handleChange} />
                </div>

                {post.canvases.map((_, index) => (
                    <div key={index} className="canvas-container">
                        <label>Frame: {index + 1}</label><br />
                        <canvas
                            ref={el => canvasRefs.current[index] = el}
                            width="500"
                            height="500"
                            className="animation-canvas"
                            style={{ backgroundColor: 'white', border: '1px solid #000' }}
                        />
                        <br />
                    </div>
                ))}

                <div className="button-group">
                    <button type="button" onClick={addCanvas}>Add Frame</button>
                    {post.canvases.length > 1 && (
                        <button type="button" onClick={removeCanvas}>Remove Frame</button>
                    )}
                </div>
                
                <div>
            <div>
            {/* Button to trigger GIF creation */}
            <button onClick={createGIF}>Preview Animation</button>                
            </div>

            
            {/* Display the GIF if the URL is set */}
            {gifUrl && <img src={gifUrl} alt="Generated GIF" style={{backgroundColor : 'white'}}/>}
        </div>
        <div className="form-group">
                    <input type="submit" value="Create Animation" />
                </div>

            </form>
        </div>
    );
};

export default CreateAnimation;

