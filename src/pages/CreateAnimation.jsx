import React, { useState, useRef, useEffect, useMemo } from 'react';
import './CreatePost.css';
import GifEncoder from 'gif-encoder-2';
import { supabase } from '../client';
import { Buffer } from 'buffer';


const CreateAnimation = () => {
    const [post, setPost] = useState({ title: "", author: "", description: "", canvases: [], frameDelay: 500 });
    const canvasRefs = useRef([]);
    const [currentColorIndex, setCurrentColorIndex] = useState(0); // Index to keep track of the current color

    const [gifUrl, setGifUrl] = useState('');
    const [showGifPreview, setShowGifPreview] = useState(false);

    window.Buffer = Buffer;

    // This useEffect ensures that canvasRefs.current always has the same length as post.canvases
    useEffect(() => {
        canvasRefs.current = canvasRefs.current.slice(0, post.canvases.length);
    }, [post.canvases.length]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Special handling for frameDelay to ensure it is stored as an integer
        if (name === 'frameDelay') {
            const intValue = parseInt(value, 10);
            setPost((prev) => ({
                ...prev,
                [name]: isNaN(intValue) ? 500 : intValue, // Use default value if conversion fails
            }));
        } else {
            // Handle all other fields normally
            setPost((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


const copyCanvas = () => {

    if (post.canvases.length <= 1) {
        alert("Please add at least one prior frame for reference.");
        return;
    }

    const currentCanvas = canvasRefs.current[post.canvases.length - 1].getContext('2d');
    const previousCanvas = canvasRefs.current[post.canvases.length - 2].getContext('2d').getImageData(0, 0, 500, 500);

    currentCanvas.putImageData(previousCanvas, 0, 0);

};

const createGIF = () => {
    return new Promise(async (resolve, reject) => {
        if (post.canvases.length === 0) {
            alert("Please add at least one frame.");
            reject("No frames added.");
            return;
        }

        const width = 500;
        const height = 500;

        const gif = new GifEncoder(width, height);
        gif.setDelay(post.frameDelay); // Adjust delay as needed
        gif.start();

        for (const canvas of canvasRefs.current) {
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Change transparent background to white
                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i + 3] === 0) {
                        imageData.data[i] = 255;
                        imageData.data[i + 1] = 255;
                        imageData.data[i + 2] = 255;
                        imageData.data[i + 3] = 255;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                gif.addFrame(ctx);
            }
        }

        gif.finish();

        const blob = new Blob([gif.out.getData()], { type: 'image/gif' });
        const url = URL.createObjectURL(blob);
        setGifUrl(url);
        setShowGifPreview(!showGifPreview); // Show the GIF preview after creating the GIF
        resolve(blob); // Resolve with the blob for uploading
        return blob;
    });
};

const createPost = async (event) => {
    event.preventDefault();

    try {
        const blob = await createGIF(); // Wait for the GIF creation to finish
        setShowGifPreview(false); // Hide the GIF preview after creating the post

        // Upload the blob to Supabase Storage
        const fileName = `gifs_${Date.now()}-post.gif`; // Unique file name
        const { error: uploadError } = await supabase.storage
            .from('animations')
            .upload(fileName, blob);

        if (uploadError) {
            throw uploadError;
        }

        // Get the public URL of the uploaded file
        const publicURL = `https://dsmzsdwcqosymcyvemmn.supabase.co/storage/v1/object/public/animations/${fileName}`;

        // Save the post details along with the public URL of the GIF in the database
        await supabase
            .from('Posts')
            .insert({
                title: post.title, 
                author: post.author, 
                description: post.description, 
                canvas: publicURL // Save the public URL to the database for later retrieval
            });

        window.location = "/";
    } catch (error) {
        console.error("Failed to create GIF or post:", error);
    }
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

    const colors = useMemo(() => ['black', 'red', 'blue', 'green', 'yellow'], []); // Array of colors to cycle through

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
                        context.beginPath();
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
            }
        });
    }, [post.canvases, currentColorIndex, colors]); // Add currentColorIndex and colors to the dependency array

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

                <div className="form-group">
                    <label htmlFor="frameDelay">Frame Delay</label><br />
                    <textarea
                        id="frameDelay"
                        name="frameDelay"
                        rows="1"
                        cols="1"
                        value={post.frameDelay.toString()} // Convert the integer frameDelay back to a string for the textarea
                        onChange={handleChange}
                    />
                </div>


                {post.canvases.map((_, index) => (
                    <div key={index} className="canvas-container">
                        <label>Frame: {index + 1}</label><br />
                        <canvas
                            ref={el => canvasRefs.current[index] = el}
                            width="500"
                            height="500"
                            className="animation-canvas"
                            style={{ backgroundColor: 'white', border: '5px solid', borderColor: colors[currentColorIndex] }}
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
                <button onClick={copyCanvas} type="button">Copy Previous Frame</button>
                <div>
            <div>
            <button onClick={createGIF} type="button">Preview Animation</button>                   
            </div>
            {gifUrl && showGifPreview && <img src={gifUrl} alt="Generated GIF" style={{backgroundColor : 'white'}}/>}
            </div>
                <div className="form-group">
                    <input type="submit" value="Create Animation" />
                </div>
            </form>
        </div>
    );
};

export default CreateAnimation;

