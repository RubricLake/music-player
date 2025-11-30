import { useState, useRef } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { SongFile, PlayerControl } from "./types";
import PlayIcon from './assets/play-circle.svg';
import PauseIcon from './assets/pause-circle.svg';
import "./App.css";


function App() {

  const [currentSong, setCurrentSong] = useState<SongFile | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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
        audioRef.current.load();
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

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
    handleController(isPlaying ? PlayerControl.Pause : PlayerControl.Play);
  }
  
  return (
    <div className="container">
      <h1> Music-Player</h1>
      <button onClick={selectFile}> Choose Song! </button>
      { currentSong &&
        <div className="player-box">
        <p>Now Playing: <strong>{currentSong.name}</strong></p>
        {audioRef.current && <p>Volume: {Math.round(audioRef.current.volume * 100) / 100}</p>}
        <audio ref={audioRef} id="player" src={currentSong.url}></audio>
        <div className="control-board">  
          <img 
          src= {isPlaying ? PauseIcon : PlayIcon}
          className="play-toggle" 
          onClick={ handleTogglePlay }
          />
          <button id="volup" onClick={ () => handleController(PlayerControl.VolumeUp) }>Vol +</button> 
          <button id="voldown" onClick={ () => handleController(PlayerControl.VolumeDown) }>Vol -</button> 
        </div>
      </div>
      }
    </div>
  );

}

export default App;
