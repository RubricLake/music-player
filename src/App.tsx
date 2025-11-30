import { useState, useRef } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

import "./App.css";

import { SongFile, PlayerControl } from "./types";

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
  
  const handleController = (type: PlayerControl) => {
    if (!audioRef.current) return;

    switch (type) {
      case PlayerControl.Play:
        audioRef.current.play();
        break;
      case PlayerControl.Pause:
        audioRef.current.pause();
        break;
      case PlayerControl.VolumeUp:
        audioRef.current.volume += 0.1;
        break;
      case PlayerControl.VolumeDown:
        audioRef.current.volume -= 0.1;
        break;
    }
  }
  
  return (
    <div className="container">
      <h1> Music-Player</h1>
      <button onClick={selectFile}> Choose Song! </button>
      { currentSong &&
        <div className="player-box">
        <p>Now Playing: <strong>{currentSong.name}</strong></p>
        <audio ref={audioRef} id="player" src={currentSong.url}></audio>
        <div className="control-board"> 
          <button id="play" onClick={ () => handleController(PlayerControl.Play) }>Play</button> 
          <button id="pause" onClick={ () => handleController(PlayerControl.Pause) }>Pause</button> 
          <button id="volup" onClick={ () => handleController(PlayerControl.VolumeUp) }>Vol +</button> 
          <button id="voldown" onClick={ () => handleController(PlayerControl.VolumeDown) }>Vol -</button> 
        </div>
      </div>
      }
    </div>
  );

}

export default App;
