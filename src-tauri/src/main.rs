// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use telegram_notifyrs;

#[tauri::command(async)]
fn send_message(bot_token: &str, channel_id: i64, msg: &str) {
    telegram_notifyrs::send_message(msg.to_string(), bot_token, channel_id);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
