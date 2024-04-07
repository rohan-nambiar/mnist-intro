import React, { useRef, useState } from 'react';
import './App.css';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  
  const scale = 2; // Scale factor used to scale the canvas


  const startDrawing = (e: React.MouseEvent) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  setIsDrawing(true);

  // Adjusting the start position for the scale
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / scale;
  ctx.moveTo(x, y);
};



const draw = (e: React.MouseEvent) => {
  if (!isDrawing) return;
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  // Adjust mouse coordinates for the scaled canvas
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / scale;

  // Adjust drawing properties for scale
  ctx.lineWidth = 1 / scale; // Adjust line width according to the scale
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000000'; // Drawing color
  ctx.lineTo(x, y);
  ctx.stroke();
};

const stopDrawing = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.beginPath(); // Begin a new path to prevent continuous line drawing
  }
  setIsDrawing(false);
  convertCanvasToFloats();
};


  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF'; // Set fill color to white
      ctx.fillRect(0, 0, canvas!.width, canvas!.height); // Fill the canvas with white
    }
  };


  const convertCanvasToFloats = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let floats = [];
    for (let i = 0; i < data.length; i += 4) {
        // Subtract the normalized value from 1 to invert the colors
        let value = 1 - (data[i] / 255); // Invert and normalize the pixel value to [0, 1]
        floats.push(value);
    }

    // Send the float values as imageData to your server
    fetch('http://localhost:8080/image/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData: floats }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setApiResponseData(data);

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };



  return (
    <div className="app-container">
      <div className="buttons-container">
        <button onClick={() => setIsDrawing(false)} className="action-button">Draw</button>
        <button onClick={clearCanvas} className="action-button">Clear</button>
        <button onClick={convertCanvasToFloats} className="action-button">Calculate</button>
      </div>
      <div className="canvas-wrapper"> {/* Wrapper to maintain layout flow */}
        <canvas
          ref={canvasRef}
          width="28"
          height="28"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            border: '1px solid black',
            transform: 'scale(2)',
            transformOrigin: 'top',
          }}
        ></canvas>
      </div>
      {apiResponseData && (
        <div className="api-response-container">
          <h3>API Response:</h3>
          <pre>{JSON.stringify(apiResponseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
