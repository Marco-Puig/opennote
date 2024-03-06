import React, { useState, useRef, useEffect } from "react";
import "./CreateAnimation.css";
import GifEncoder from "gif-encoder-2";
import { supabase } from "../client";
import { Buffer } from "buffer";
import { SketchPicker } from "react-color";

const CreateAnimation = () => {
  const [post, setPost] = useState({
    title: "",
    author: "",
    description: "",
    canvases: [],
    frameDelay: 500,
  });
  const canvasRefs = useRef([]);

  const [currentColor, setCurrentColor] = useState("#000000");
  const [showColorPick, setShowColorPick] = useState(false);

  const [gifUrl, setGifUrl] = useState("");
  const [showGifPreview, setShowGifPreview] = useState(false);

  const [brushSize, setBrushSize] = useState(5); // Default brush size
  const [eraserSize, setEraserSize] = useState(5); // Default brush size

  const width = 600;
  const height = 525;

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

  // Function to update frameDelay based on button click
  const setFrameDelay = (delay) => {
    setPost((prev) => ({
      ...prev,
      frameDelay: delay,
    }));

    createGIF();
  };

  const copyCanvas = () => {
    if (post.canvases.length <= 1) {
      alert("Please add at least one prior frame for reference.");
      return;
    }

    const currentCanvas =
      canvasRefs.current[post.canvases.length - 1].getContext("2d");
    const previousCanvas = canvasRefs.current[post.canvases.length - 2]
      .getContext("2d")
      .getImageData(0, 0, width, height);

    currentCanvas.putImageData(previousCanvas, 0, 0);
  };

  const showHideGifPreview = () => {
    if (post.canvases.length <= 1) {
      alert("Please add at least two frames for an animation.");
      return;
    }

    createGIF();
    setShowGifPreview(!showGifPreview);
  };

  const createGIF = () => {
    return new Promise(async (resolve, reject) => {
      if (post.canvases.length === 0) {
        alert("Please add at least one frame.");
        reject("No frames added.");
        return;
      }

      const gif = new GifEncoder(width, height);
      gif.setDelay(post.frameDelay); // Adjust delay as needed
      gif.start();

      for (const canvas of canvasRefs.current) {
        if (canvas) {
          const ctx = canvas.getContext("2d");
          const imageData = ctx.getImageData(0, 0, width, height);

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

      const blob = new Blob([gif.out.getData()], { type: "image/gif" });
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
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
        .from("animations")
        .upload(fileName, blob);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded file
      const publicURL = `https://dsmzsdwcqosymcyvemmn.supabase.co/storage/v1/object/public/animations/${fileName}`;

      // Save the post details along with the public URL of the GIF in the database
      await supabase.from("Posts").insert({
        title: post.title,
        author: post.author,
        description: post.description,
        canvas: publicURL, // Save the public URL to the database for later retrieval
      });

      window.location = "/opennote"; // Redirect to the home page after creating the post
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

  const showBrushColors = () => {
    setShowColorPick(!showColorPick);
  };

  useEffect(() => {
    post.canvases.forEach((_, index) => {
      const canvas = canvasRefs.current[index];
      if (canvas) {
        const context = canvas.getContext("2d");
        let isDrawing = false;

        const startDrawing = (event) => {
          isDrawing = true;
          const rect = canvas.getBoundingClientRect();
          const offsetX = event.clientX - 5 - rect.left;
          const offsetY = event.clientY - 5 - rect.top;
          context.beginPath();
          context.moveTo(offsetX, offsetY);

          // Brush Color
          if (event.button === 0) {
            context.strokeStyle = currentColor;
            context.lineWidth = brushSize; // Use brushSize for line width
          } else if (event.button === 2) {
            // Eraser
            context.strokeStyle = "white";
            context.lineWidth = eraserSize; // Use brushSize for line width
          }
        };

        const draw = (event) => {
          if (isDrawing) {
            const rect = canvas.getBoundingClientRect();
            const offsetX = event.clientX - 5 - rect.left;
            const offsetY = event.clientY - 5 - rect.top;
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

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("contextmenu", (event) =>
          event.preventDefault()
        );

        return () => {
          canvas.removeEventListener("mousedown", startDrawing);
          canvas.removeEventListener("mousemove", draw);
          canvas.removeEventListener("mouseup", stopDrawing);
          canvas.removeEventListener("contextmenu", (event) =>
            event.preventDefault()
          );
        };
      }
    });
  }, [post.canvases, currentColor, brushSize, eraserSize]);

  return (
    <div className="create-animation">
      <form onSubmit={createPost}>
        <div className="form-group">
          <label htmlFor="title">Title</label> <br />
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
          />
          <br />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <br />
          <input
            type="text"
            id="author"
            name="author"
            value={post.author}
            onChange={handleChange}
          />
          <br />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            name="description"
            rows="2"
            cols="50"
            value={post.description}
            onChange={handleChange}
          />
        </div>

        {post.canvases.map((_, index) => (
          <div key={index} className="canvas-container">
            <label>Frame: {index + 1}</label>
            <br />
            <canvas
              ref={(el) => (canvasRefs.current[index] = el)}
              width={width}
              height={height}
              className="animation-canvas"
              style={{
                backgroundColor: "white",
                border: "5px solid",
                borderColor: currentColor,
              }}
            />
            <br />
          </div>
        ))}
        <div className="button-group">
          <label>Edit Tools:</label>
          <div>
            <button type="button" onClick={addCanvas}>
              Add Frame
            </button>
            {post.canvases.length > 1 && (
              <button type="button" onClick={removeCanvas}>
                Remove Frame
              </button>
            )}
            <button onClick={copyCanvas} type="button">
              Copy Previous Frame
            </button>
          </div>
        </div>

        <div></div>
        <label>Brush Tools:</label>
        <div>
          <button type="button" onClick={showBrushColors}>
            Change Brush Color
          </button>
          <div>
            {showColorPick && (
              <SketchPicker
                color={currentColor}
                onChangeComplete={(color) => setCurrentColor(color.hex)}
              />
            )}
          </div>
          <div>
            <label htmlFor="brushSize">Brush Size: {brushSize} </label>
            <input
              id="brushSize"
              type="range"
              min="1"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
              style={{ margin: "0 10px" }}
            />
          </div>
          <div>
            <label htmlFor="eraserSize">Eraser Size: {eraserSize} </label>
            <input
              id="eraserSize"
              type="range"
              min="1"
              max="40"
              value={eraserSize}
              onChange={(e) => setEraserSize(e.target.value)}
              style={{ margin: "0 10px" }}
            />
          </div>
        </div>
        <div>
          <div>
            <label>Animation Settings:</label>
            <div>
              <button onClick={showHideGifPreview} type="button">
                {showGifPreview ? "Hide" : "Show"} Preview Animation
              </button>
              {showGifPreview && (
                <button onClick={createGIF} type="button">
                  Refresh Preview
                </button>
              )}
            </div>
            <div>
              {showGifPreview &&
                [100, 200, 300, 400, 1000, 5000].map((delay, index) => {
                  const durations = ["1s", "2s", "3s", "4s", "10s", "50s"];
                  return (
                    <button
                      key={delay}
                      type="button"
                      onClick={() => setFrameDelay(delay)}
                    >
                      {durations[index]}
                    </button>
                  );
                })}
            </div>
          </div>
          {gifUrl && showGifPreview && (
            <img
              src={gifUrl}
              alt="Generated GIF"
              style={{ backgroundColor: "white" }}
            />
          )}
        </div>
        <div className="form-group">
          <input
            type="submit"
            value={post.canvases.length > 1 ? "Post Animation" : "Create Post"}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateAnimation;
