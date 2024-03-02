import React, { useState, useRef, useEffect } from 'react';
import './CreatePost.css';
import GIF from 'gif.js';

import { supabase } from '../client';

const CreateAnimation = () => {
    const [post, setPost] = useState({ title: "", author: "", description: "", canvases: [] });
    const canvasRefs = useRef([]);

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

    // Function to create and upload GIF
    const createGIF = async () => {
        
        if (post.canvases.length === 0) {
            alert("Please add at least one frame.");
            return;
        }
        if (post.canvases.length === 0 || canvasRefs.current.some(ref => !ref)) {
            console.warn("Canvas elements are not ready or no frames added");
            return;
        }

        const width = 500;
        const height = 500;

        let gif = new GIF({
            workers: 2,
            quality: 10,
            width: width,
            height: height,
        });

        canvasRefs.current.forEach((canvas, index) => {
            if (canvas) {
                gif.addFrame(canvas, { copy: true, delay: 200 /* frame rate */});
            } else {
                console.warn(`Canvas ${index} is not available or not ready`);
            }
        });

        gif.on('finished', async (blob) => {
            const fileName = `animation_${new Date().getTime()}.gif`;
            const { data, error } = await supabase.storage.from('animations').upload(fileName, blob);

            if (error) {
                console.error('Upload error:', error);
                return;
            }

            await supabase.from('Posts').insert({
                title: post.title,
                author: post.author,
                description: post.description,
                canvas: fileName,
            });

            console.log('GIF uploaded successfully:', data);
            window.location = "/";
        });

        gif.render();
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

                <div className="form-group">
                    <input type="submit" value="Create Animation" />
                </div>
            </form>
        </div>
    );
};

export default CreateAnimation;

