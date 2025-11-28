
use std::io::BufReader;
use std::time::Duration;
use rodio::Source;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn load_audio(path: &str) -> Result<(), String> {
    let stream_handle = rodio::OutputStreamBuilder::open_default_stream()
        .map_err(|e| e.to_string())?;

    let mixer = stream_handle.mixer();

    let audio = {
        let file = std::fs::File::open(path).map_err(|e| e.to_string())?;
        let sink = rodio::play(mixer, BufReader::new(file)).map_err(|e| e.to_string())?;
        sink.set_volume(0.5);
        sink
    };

    println!("Started Playing: {}", path);
    audio.sleep_until_end();

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![load_audio])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
