import React, { useState, useRef, useEffect } from "react";

interface FolderComponentProps {
  content: React.ReactNode;
}

const FolderComponent: React.FC<FolderComponentProps> = ({ content }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [folderOffset, setFolderOffset] = useState({ x: 0, y: 0 });
  const folderElementRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (!folderElementRef.current) return;

    setIsDragging(true);
    setDragOffset({ x: event.clientX, y: event.clientY });
    setFolderOffset({
      x: folderElementRef.current.offsetLeft,
      y: folderElementRef.current.offsetTop,
    });

    // Create a ghost folder with the same size as the original folder
    const ghostFolder = document.createElement("div");
    ghostFolder.classList.add("folder", "ghost");
    ghostFolder.style.width = folderElementRef.current.offsetWidth + "px";
    ghostFolder.style.height = folderElementRef.current.offsetHeight + "px";
    ghostFolder.style.top = folderElementRef.current.offsetTop + "px";
    ghostFolder.style.left = folderElementRef.current.offsetLeft + "px";
    document.body.appendChild(ghostFolder);
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!folderElementRef.current) return;

    folderElementRef.current.classList.remove("selected");
    const infoElement = document.getElementById(
      folderElementRef.current.getAttribute("link")!
    );

    if (infoElement) {
      const videos = infoElement.querySelectorAll("video");
      if (videos.length > 0) {
        for (const video of videos) {
          if (video.parentNode?.parentNode === infoElement) {
            video.play();
          }
        }
      }

      infoElement.style.visibility = "visible";
      infoElement.style.transform = "translate(-50%, -50%) scale(1)";
    }

    event.preventDefault();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging && folderElementRef.current) {
      const newTop = folderOffset.y + event.clientY - dragOffset.y;
      const newLeft = folderOffset.x + event.clientX - dragOffset.x;
      folderElementRef.current.style.top = newTop + "px";
      folderElementRef.current.style.left = newLeft + "px";
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (isDragging && folderElementRef.current) {
      setIsDragging(false);
      setFolderOffset({
        x: folderOffset.x + event.clientX - dragOffset.x,
        y: folderOffset.y + event.clientY - dragOffset.y,
      });

      // Remove the ghost folder
      const ghostFolder = document.querySelector(".folder.ghost");
      if (ghostFolder && ghostFolder.parentNode) {
        ghostFolder.parentNode.removeChild(ghostFolder);
      }

      event.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <div
      ref={folderElementRef}
      className="folder"
      onClick={(event) => {
        folderElementRef.current?.classList.add("selected");
        event.preventDefault();
      }}
      onDragStart={handleDragStart}
      onDoubleClick={handleDoubleClick}
      draggable={true}
    >
      {content}
    </div>
  );
};

export default FolderComponent;
