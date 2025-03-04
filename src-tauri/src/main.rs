#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::command;
use std::fs::File;

#[command]
fn read_file(path: String) -> Result<String, String> {
    use std::io::Read;
    // 不存在不报错，返回空字符串
    if !std::path::Path::new(&path).exists() {
        return Ok("".to_string());
    }

    // 路径相对于运行时的可执行文件，考虑到 path 不包含用户输入，所以没检查
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let mut content = String::new();
    file.read_to_string(&mut content).map_err(|e| e.to_string())?;
    Ok(content)
}

#[command]
fn write_file(path: String, content: String) -> Result<(), String> {
    use std::io::Write;
    let mut file = File::create(path).map_err(|e| e.to_string())?;
    file.write_all(content.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![read_file, write_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
