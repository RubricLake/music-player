// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// TODO: Initializes directory if it doesn't exist
#[tauri::command]
fn init() {
    println!("hello world");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![init])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
