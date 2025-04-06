#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{
    Manager,
    command,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
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
        .setup(|app| {
            let quit_item = MenuItem::with_id(app, "quit", "退出", true, None::<&str>).unwrap();
            let menu = Menu::with_items(app, &[&quit_item]).unwrap();

            TrayIconBuilder::new()
                .tooltip("ExCaller")
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        let window = tray.app_handle().get_webview_window("main").unwrap();
                        window.show().ok();
                        window.set_focus().ok();
                    }
                    _ => {}
                })
                .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
