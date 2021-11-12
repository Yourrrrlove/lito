#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod callback;
mod composition;
mod env;
mod form;
mod form_nchittest;
mod main_form;
mod pwstr;
mod shell;
mod web_resource_handler;
mod webview;
mod webview_install_form;
mod ui;
mod types;
mod lyrics_window;
use bindings::Windows::Win32::System::Com::CoInitialize;
use bindings::Windows::Win32::UI::WindowsAndMessaging;
#[cfg(not(debug_assertions))]
use include_dir::Dir;
use main_form::MainForm;
use webview_install_form::WebViewInstallForm;
use windows::*;
use crate::lyrics_window::LyricsWindow;
use crate::ui::Window;
use std::ptr::null_mut;

#[macro_use]
extern crate callback_macros;

#[cfg(not(debug_assertions))]
#[macro_use]
extern crate include_dir;

#[cfg(debug_assertions)]
const DEBUG: bool = true;
#[cfg(not(debug_assertions))]
const DEBUG: bool = false;

const APP_URL: &str = if DEBUG {
    "http://127.0.0.1:3000/"
} else {
    "https://app.example/"
};

#[cfg(not(debug_assertions))]
static APP_DIR: Dir = include_dir!("..\\packages\\lito\\dist");

fn main() -> Result<()> {
    check_webview_installation()?;
    unsafe {
        // SetProcessDPIAware();
        CoInitialize(null_mut())?;
    }
    let lyrics_window = &mut LyricsWindow::new()?;
    lyrics_window.show()?;
println!("!!!{:?}",lyrics_window.get_hwnd());
    main_form::init()?;
    let mut main_form = MainForm::create()?;
    main_form.set_lyric(lyrics_window.get_hwnd());
    main_form.show(false);
    form::dispatch_message_loop()?;

    Ok(())
}

fn check_webview_installation() -> Result<()> {
    match webview::get_version() {
        Ok(_) => Ok(()),
        Err(_) => unsafe {
            let result = WindowsAndMessaging::MessageBoxW(
                None,
                "Edge WebView2 Runtime is missing.\nWould you like to download it now?",
                "Edge WebView2 Runtime",
                WindowsAndMessaging::MB_ICONQUESTION | WindowsAndMessaging::MB_YESNO,
            );
            if result == WindowsAndMessaging::IDYES {
                webview_install_form::init()?;
                let webview_install_form = WebViewInstallForm::create()?;
                webview_install_form.show(true)?;
                form::dispatch_message_loop()?;
            }
            std::process::exit(1);
        },
    }
}
