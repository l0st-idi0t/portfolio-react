import React from "react";
import "./styles/App.css";
import WeatherClockWidget from "./components/widget";
import FolderComponent from "./components/folder";

const App: React.FC = () => {
  return (
    <div>
      <WeatherClockWidget />
      <FolderComponent
        content={
          <>
            <img src="/images/folder.png" alt="Folder" />
            <span id="folderText">Hello World!</span>
          </>
        }
      />
    </div>
  );
};

export default App;
