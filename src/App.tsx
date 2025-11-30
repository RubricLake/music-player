import { useState, useRef } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

import "./App.css";

import { SongFile } from "./types";

function App() {

  const [currentSong, setCurrentSong] = useState<SongFile | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const selectFile = async () => {
    const file = await open({
      multiple: false,
      director: false,
      defaultPath: 'E:\\SteamLibrary\\steamapps\\common\\DELTARUNE\\mus',
      filters: [{name: "Audio", 
        extensions: ["mp3", "wav", "ogg", "flac"]
      }]
    });
    
    if (file) {
      const fileSplit : string[] = file.split('\\');
      const url : string = convertFileSrc(file);
      const name : string = fileSplit[fileSplit.length - 1];
      setCurrentSong({ name, url });

      console.log(`Name: ${name}`);
      console.log(`URL: ${url}`);
      
      if (audioRef.current) {
        audioRef.current.playbackRate
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  }
  
  return (
    <div className="container">
      <h1> Music-Player</h1>
      <button onClick={selectFile}> Choose Song! </button>
      { currentSong &&
        <div className="player-box">
        <p>Now Playing: <strong>{currentSong.name}</strong></p>
        <audio
        ref={audioRef}
        controls
        src={currentSong.url}
        style={{width: "100%", marginTop: "20px" }}
        />  
      </div>
      }
    </div>
  );

}

export default App;
