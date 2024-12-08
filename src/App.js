import React, { useState } from 'react';
import './App.css';

function DragDrop() {
  const [draggedElements, setDraggedElements] = useState([]);
  const [draggingElementId, setDraggingElementId] = useState(null);
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with elements:", draggedElements);
  };

  
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("elementType", type); 
    setDraggingElementId(type);
  };

  
  const handleDrop = async (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("elementType");

   
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
     
      if (file.type.startsWith("image/")) {
        const fileUrl = URL.createObjectURL(file);
        addElementToCanvas(e, "image", fileUrl);
      } else {
        console.log("Dropped file is not an image:", file);
      }
      return;
    }


    const text = e.dataTransfer.getData("text/plain");
    if (text) {
      addElementToCanvas(e, "text", text); 
    }

   
    if (type) {
      const placeholderUrl = type === "image" ? "https://via.placeholder.com/150" : "";
      addElementToCanvas(e, type, placeholderUrl); 
    }
  };

  
  const addElementToCanvas = (e, type, content = "") => {
    const canvasRect = e.target.getBoundingClientRect();
    const newElement = {
      id: draggedElements.length + 1,
      type: type,
      position: {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      },
      properties: {
        text: type === "text" ? content : "",
        imageUrl: type === "image" ? content : "",
        buttonText: type === "button" ? "Click Me" : "",
        fontSize: "16px",
        color: "#333",
      },
    };
    setDraggedElements([...draggedElements, newElement]);
    setDraggingElementId(null); 
  };

  
  const startMoving = (e, element) => {
    e.preventDefault();
    const canvasRect = e.target.closest(".canvas").getBoundingClientRect();
    setDraggingOffset({
      x: e.clientX - element.position.x - canvasRect.left,
      y: e.clientY - element.position.y - canvasRect.top,
    });
    setDraggingElementId(element.id);
  };

  
  const handleMouseMove = (e) => {
    if (draggingElementId && typeof draggingElementId === "number") {
      const updatedElements = draggedElements.map((el) => {
        if (el.id === draggingElementId) {
          return {
            ...el,
            position: {
              x: e.clientX - draggingOffset.x,
              y: e.clientY - draggingOffset.y,
            },
          };
        }
        return el;
      });
      setDraggedElements(updatedElements);
    }
  };

  const stopDragging = () => {
    setDraggingElementId(null);
  };

  return (
    <div className="card">
      <div className="top">
        <h1>Websites.co.in</h1><br />
      </div>

      
      <div className="drag-area">
        <span className="select" draggable onDragStart={(e) => handleDragStart(e, "text")}>Drag Text</span>
        <span className="select" draggable onDragStart={(e) => handleDragStart(e, "image")}>Drag Image</span>
        <span className="select" draggable onDragStart={(e) => handleDragStart(e, "button")}>Drag Button</span>
      </div>

      {/* Canvas */}
      <div
        className="canvas"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          border: '2px solid #ddd',
          marginTop: '20px',
        }}
      >
        {draggedElements.map((element) => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: element.position.x,
              top: element.position.y,
              fontSize: element.properties.fontSize,
              color: element.properties.color,
            }}
            onMouseDown={(e) => startMoving(e, element)}
          >
            {element.type === "text" && <p>{element.properties.text}</p>}
            {element.type === "image" && <img src={element.properties.imageUrl} alt="Element" style={{ width: "100px" }} />}
            {element.type === "button" && <button>{element.properties.buttonText}</button>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DragDrop;
