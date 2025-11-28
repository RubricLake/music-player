import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

import "./App.css";

function App() {
  const [errText, setErrText] = useState("");
  
  async function openFile() {
    const filePath : String | null = await open({
      multiple: false,
      directory: false,
      defaultPath: "E:\\SteamLibrary\\steamapps\\common\\DELTARUNE\\mus",
      filters: [
        {
          name: "Audio Files",
          extensions: ["mp3", "wav", "flac", "ogg"]
        }
      ]
    });

    if (!filePath) {
      console.log("User closed dialog.");
      return;
    }

    try {
      await invoke("load_audio", {path: filePath });
    } catch (err) {
      setErrText("Could not load audio :(");
    }
  }

  return (
    <main className="container">
      <h1> Music-Player</h1>
      <button onClick={openFile}>Choose Song!</button>
      {errText.length > 0 && <p> {errText} </p>}
    </main>
  );
}

export default App;
