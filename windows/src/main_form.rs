use std::ffi::{CStr, CString};
use std::sync::atomic::{AtomicBool, AtomicI64, AtomicI8, AtomicUsize, Ordering};
use bindings::{
    Microsoft::Web::WebView2::Win32::{
        ICoreWebView2, ICoreWebView2WebMessageReceivedEventArgs,
        ICoreWebView2WebResourceRequestedEventHandler, COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL,
    },
    Windows::Win32::{
        Foundation::{E_POINTER, HWND, LPARAM, LRESULT, PWSTR, RECT, WPARAM},
        Graphics::{DirectComposition, Dwm},
        System::Com,
        UI::{Controls, KeyboardAndMouseInput,Shell, WindowsAndMessaging},
        System::LibraryLoader::GetModuleHandleW
    },
};
use serde::{Deserialize, Serialize};
use windows::*;
use bindings::Windows::Win32::Foundation::HINSTANCE;
use crate::{
    callback,
    composition::WebViewFormComposition,
    env::ParsedArgs,
    form::{self, center_window, dip_to_px},
    pwstr,
    shell::NotificationIcon,shell::TaskBar,
    web_resource_handler::WebResourceHandler,
    webview, APP_URL, DEBUG,
};

const CLASS_NAME: &str = "LitoMainForm";

const WM_USER_WEBVIEW_CREATE: u32 = WindowsAndMessaging::WM_USER;
const WM_USER_ICONNOTIFY: u32 = WindowsAndMessaging::WM_USER + 1;
use bindings::Windows::Win32::Foundation::PSTR;
// use crate::shell::TaskBarUpdate;
use crate::webview::WebView;

pub struct MainForm {
    h_wnd: HWND,
    _notification_icon: NotificationIcon,
    composition: WebViewFormComposition,
    webview: webview::WebView,
    lyric_hwnd:Option<HWND>,
    taskbarmes:u32,
    music_pause:AtomicBool,
    music_time:AtomicI64,
    music_duration:AtomicI64,
    h_instance:HINSTANCE,
    taskbar:TaskBar
}

pub fn init() -> Result<()> {
    unsafe { Com::CoInitializeEx(std::ptr::null_mut(), Com::COINIT_APARTMENTTHREADED)?;
        // println!("{:?}",);

    };
    form::register_class(CLASS_NAME, Some(wndproc))?;
    Ok(())
}


fn create_window() -> Result<HWND> {
    let h_wnd = form::create_window(
        None,
        CLASS_NAME,
        "Lito Music",
        WindowsAndMessaging::WS_OVERLAPPEDWINDOW,
        WindowsAndMessaging::WS_EX_NOREDIRECTIONBITMAP,
        RECT::default(),
    )?;
    form::set_window_bounds(
        h_wnd,
        RECT {
            right: dip_to_px(h_wnd, 1024),
            bottom: dip_to_px(h_wnd, 768),
            ..Default::default()
        },
    )?;
    center_window(h_wnd)?;
    Ok(h_wnd)
}

impl MainForm {
    pub fn set_lyric(&mut self, l_hwnd:HWND) -> Result<()>{
self.lyric_hwnd= Some(l_hwnd);
Ok(())

    }
    pub fn create() -> Result<Self> {
        let h_wnd = create_window()?;
        unsafe {
            Dwm::DwmExtendFrameIntoClientArea(
                h_wnd,
                &Controls::MARGINS {
                    cxLeftWidth: -1,
                    cyTopHeight: -1,
                    cxRightWidth: -1,
                    cyBottomHeight: -1,
                },
            )?;
        }
        unsafe { WindowsAndMessaging::SetTimer(h_wnd, 1, 1000, None); }
        let notification_icon = NotificationIcon::new(h_wnd, Some(WM_USER_ICONNOTIFY));
        notification_icon.show(true);
        let webview_composition = WebViewFormComposition::new(h_wnd)?;
        let mut webview = webview::WebView::new(
            h_wnd,
            webview_composition.get_dcomp_device().clone(),
            webview_composition.get_webview_visual().cast()?,
        );

        webview.create(move || unsafe {
            WindowsAndMessaging::PostMessageW(
                h_wnd,
                WM_USER_WEBVIEW_CREATE,
                WPARAM::default(),
                LPARAM::default(),
            );
        })?;
        let taskmes:u32=unsafe{
            WindowsAndMessaging::RegisterWindowMessageA(PSTR(b"TaskbarButtonCreated\0".as_ptr() as _),)
        };
        let h_instance=unsafe{
            GetModuleHandleW( PWSTR(0u32 as _))
        };
        let taskbar=TaskBar::new(h_wnd,h_instance);
        Ok(Self {
            h_wnd,
            _notification_icon: notification_icon,
            webview,
            lyric_hwnd:None,
            composition: webview_composition,
            taskbarmes:taskmes,
            music_pause:    AtomicBool::new(true),
music_time:AtomicI64::new(0),
music_duration:AtomicI64::new(0),
taskbar,
h_instance


        })
    }
pub fn taskbar_control(&self,c_type:i32){
    let controller=self.webview.get_controller().unwrap();
    unsafe {
        let sender=controller.get_CoreWebView2().unwrap();
        let x=format!("{{\"event\":{:?}}}",c_type);
        println!("{:?}",x.clone());
        println!("{:?}",sender.PostWebMessageAsJson(x).unwrap());
    }
}
    pub fn show(&self, visible: bool) {
        unsafe {
            WindowsAndMessaging::SetWindowLongPtrW(
                self.h_wnd,
                WindowsAndMessaging::GWL_USERDATA,
                self as *const _ as isize,
            );
            WindowsAndMessaging::ShowWindow(
                self.h_wnd,
                if visible {
                    WindowsAndMessaging::SW_SHOW
                } else {
                    WindowsAndMessaging::SW_MINIMIZE
                },
            );
        }
    }

    unsafe fn wndproc(
        &'static  self,
        h_wnd: HWND,
        msg: u32,
        w_param: WPARAM,
        l_param: LPARAM,
    ) -> Option<LRESULT> {
        let webview = &self.webview;
        webview.forward_mouse_messages(h_wnd, msg, w_param, l_param);
        let taskmes=self.taskbarmes;
        match msg {

            WM_USER_ICONNOTIFY => {
                match l_param.0 as u32 {
                    // TODO: Add context menu?
                    WindowsAndMessaging::WM_LBUTTONUP | WindowsAndMessaging::WM_RBUTTONUP => {
                        self.show(true);
                        WindowsAndMessaging::ShowWindow(
                            self.h_wnd,
                            WindowsAndMessaging::SW_RESTORE,
                        );
                        WindowsAndMessaging::SetForegroundWindow(h_wnd);
                    }
                    _ => {}
                };
                Some(LRESULT(0))
            }
            WM_USER_WEBVIEW_CREATE => {
                let rect = form::get_client_rect(h_wnd).unwrap();
                let width = rect.right - rect.left;
                let height = rect.bottom - rect.top;
                let l_param = LPARAM(((width & 0xffff) | ((height & 0xffff) << 16)) as isize);
                WindowsAndMessaging::PostMessageW(
                    h_wnd,
                    WindowsAndMessaging::WM_SIZE,
                    WPARAM(WindowsAndMessaging::SIZE_RESTORED as usize),
                    l_param,
                );
                if let Some(controller) = webview.get_controller() {
                    let webview2 = controller.get_CoreWebView2().unwrap();
                    if !DEBUG {
                        webview2
                            .AddWebResourceRequestedFilter(
                                APP_URL.to_string() + "*",
                                COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL,
                            )
                            .unwrap();

                        let mut _token = Default::default();
                        webview2
                            .add_WebResourceRequested(
                                ICoreWebView2WebResourceRequestedEventHandler::from(
                                    WebResourceHandler::new(),
                                ),
                                &mut _token,
                            )
                            .unwrap();
                    }
                    if ParsedArgs::from_args().dev_tools() {
                        webview2.OpenDevToolsWindow().unwrap();
                    }
                    let mut _token = Default::default();
                    webview2
                        .add_WebMessageReceived(
                            callback::WebMessageReceivedEventHandler::create(Box::new(
                                move |webview2, args| self.web_message_received(webview2, args),
                            )),
                            &mut _token,
                        )
                        .unwrap();

                    webview2
                        .AddScriptToExecuteOnDocumentCreated(
                            r#"
                                document.addEventListener("mousedown", event => {
                                    if (event.button !== 0) return
                                    const appRegion = window.getComputedStyle(event.target).getPropertyValue('--app-region')
                                    if (appRegion === 'drag') {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        if (event.detail % 2 == 0) {
                                            window.chrome.webview.postMessage({ event: "CaptionDblClick" })
                                        } else {
                                            window.chrome.webview.postMessage({ event: "CaptionMouseDown" })
                                        }
                                    }
                                })
                            "#,
                            None,
                        )
                        .unwrap();
                    webview2
                        .Navigate(APP_URL.to_string() + "index.html")
                        .unwrap();
                    controller.put_IsVisible(true).unwrap();
                    self.show(true);
                }
                Some(LRESULT(0))
            }
            WindowsAndMessaging::WM_TIMER=>{
                match w_param {
                    WPARAM(1) => {
                        if self.music_pause.load(Ordering::SeqCst) == false {
                            self.music_time.fetch_add(1,Ordering::SeqCst);
                            println!("{}",self.music_time.load(Ordering::SeqCst));
                            println!("{}",self.music_duration.load(Ordering::SeqCst));
                            self.taskbar.progressbar_update(self.music_time.load(Ordering::SeqCst),self.music_duration.load(Ordering::SeqCst));
                            Some(LRESULT(1))

                        }else {
                            None
                        }
                    }
                    _=>{
                        None
                    }
                }

            }
                WindowsAndMessaging::WM_NCHITTEST => {
                let result = self.composition.nc_hittest(l_param).unwrap();
                if result != WindowsAndMessaging::HTNOWHERE {
                    Some(LRESULT(result as i32))
                } else {
                    Some(LRESULT(WindowsAndMessaging::HTCLIENT as i32))
                }
            }
            WindowsAndMessaging::WM_COMMAND =>{
                if w_param.0 >> 16 ==6144  {
                    println!("Clicked {:?}",(w_param.0 >> 16));
                    println!("Clicked {:?}",(w_param.0  & 0xffff ) as u32);
                    let BUTTON_ID: u32 =(w_param.0  & 0xffff)  as u32;
                    match BUTTON_ID {
                        24849 =>{
                            self.taskbar_control(0);
                            // TaskBarUpdate(h_wnd,self.h_instance,1)
                        }
                        24850 =>{
                            self.taskbar_control(-1);

                        }
                        24851 =>{
                            self.taskbar_control(1);

                        }
                        _ => {}
                    }
                    return Some(LRESULT(0));

                }
                None
            }

            WindowsAndMessaging::WM_MOVING => {
                if let Some(controller) = self.webview.get_controller() {
                    controller.NotifyParentWindowPositionChanged().unwrap();
                }
                None
            }
            WindowsAndMessaging::WM_SIZE => {
                let is_minimized = w_param.0 == WindowsAndMessaging::SIZE_MINIMIZED as usize;
                if is_minimized {
                    self.show(false);

                }
                self.composition.update(w_param).unwrap();
                let width = (l_param.0 & 0xffff) as i32;
                let height = ((l_param.0 >> 16) & 0xffff) as i32;
                if let Some(controller) = webview.get_controller() {
                    let mut bounds = RECT {
                        right: width,
                        bottom: height,
                        ..Default::default()
                    };
                    if w_param.0 == WindowsAndMessaging::SIZE_MAXIMIZED as usize {
                        let cy_frame =
                            WindowsAndMessaging::GetSystemMetrics(WindowsAndMessaging::SM_CYFRAME);
                        let cx_padded_border = WindowsAndMessaging::GetSystemMetrics(
                            WindowsAndMessaging::SM_CXPADDEDBORDER,
                        );
                        bounds.top = cy_frame + cx_padded_border;
                    }
                    controller.put_Bounds(bounds).unwrap();
                    let webview_visual = self.composition.get_webview_visual();
                    // TODO: Remove the workaround when https://github.com/microsoft/win32metadata/issues/600 is fixed.
                    let set_offset_y: unsafe extern "system" fn(
                        DirectComposition::IDCompositionVisual,
                        f32,
                    ) -> HRESULT = std::mem::transmute(webview_visual.vtable().6);
                    set_offset_y(webview_visual.clone(), bounds.top as f32)
                        .ok()
                        .unwrap();
                    self.composition.commit().unwrap();
                }
                Some(LRESULT(0))
            }

            _ => {
                if msg==taskmes {

                    println!("!!!!010");
                    self.taskbar.init_buttons();

                    // TaskBar(self.h_wnd,self.h_instance);
                    // self.taskbar_create.fetch_add(1,Ordering::Relaxed);
                    Some(LRESULT(1))
                }else {
                    None
                }
            },
        }
    }

    unsafe fn web_message_received(
        &'static self,
        _webview2: Option<ICoreWebView2>,
        args: Option<ICoreWebView2WebMessageReceivedEventArgs>,
    ) -> Result<()> {
        let args = args.ok_or_else(|| Error::fast_error(E_POINTER))?;
        let mut message = PWSTR::default();
        args.get_WebMessageAsJson(&mut message)?;
        let message = pwstr::take_pwstr(message);
        #[derive(Debug, Serialize, Deserialize)]
        #[serde(tag = "event")]
        enum Message {
            CaptionMouseDown,
            CaptionDblClick,Play{ time:i64},Stop,SongUpdate{duration:i64},SongTimeChange{time:i64},
            LyricsUpdate {data:  String}
        }
        match serde_json::from_str::<'_, Message>(message.as_ref()) {
            Ok(message) => match message {
                Message::CaptionMouseDown => {

                    KeyboardAndMouseInput::ReleaseCapture();
                    WindowsAndMessaging::SendMessageW(
                        self.h_wnd,
                        WindowsAndMessaging::WM_NCLBUTTONDOWN,
                        WPARAM(WindowsAndMessaging::HTCAPTION as _),
                        LPARAM::default(),
                    );
                }
                Message::SongUpdate{duration} =>{
                    self.music_time.store(0,Ordering::SeqCst);
                    self.music_duration.store(duration,Ordering::SeqCst)
                }
                Message::SongTimeChange{time} =>{
                    self.music_time.store(time,Ordering::SeqCst);
                    self.taskbar.progressbar_update(self.music_time.load(Ordering::SeqCst),self.music_duration.load(Ordering::SeqCst));

                }
                Message::CaptionDblClick => {
                    KeyboardAndMouseInput::ReleaseCapture();
                    WindowsAndMessaging::SendMessageW(
                        self.h_wnd,
                        WindowsAndMessaging::WM_NCLBUTTONDBLCLK,
                        WPARAM(WindowsAndMessaging::HTCAPTION as _),
                        LPARAM::default(),
                    );
                }
                Message::Play{time} => {
                    self.music_pause.store(false,Ordering::SeqCst);
                    self.music_time.store(time,Ordering::SeqCst);
                    // self.music_duration.store(duration,Ordering::SeqCst);

                    self.taskbar.progressbar_update(self.music_time.load(Ordering::SeqCst),self.music_duration.load(Ordering::SeqCst));
                    self.taskbar.update(1);
                }
                Message::Stop => {
                    self.music_pause.store(true,Ordering::SeqCst);
                    self.taskbar.update(2)
                }
                    Message::LyricsUpdate{data} =>{
                    println!("{:?}",data);

                    let param: CString =CString::new(data).unwrap();

                    println!("{:?}",param);
                    println!("{:?}",param.as_ptr());

                    WindowsAndMessaging::SendMessageW(
                        self.lyric_hwnd.unwrap(),
                        WindowsAndMessaging::WM_COPYDATA ,
                        WPARAM(WindowsAndMessaging::HTCAPTION as _),
                        LPARAM(param.into_raw() as isize ),
                    );

                    // println!("{}",data);

                }
            },
            Err(e) => {
                eprintln!("Deserialize message: {:?}", e);
            }
        }
        Ok(())
    }
}

unsafe extern "system" fn wndproc(
    h_wnd: HWND,
    msg: u32,
    w_param: WPARAM,
    l_param: LPARAM,
) -> LRESULT {
    if let Some(result) = wndproc_pre(h_wnd, msg, w_param, l_param) {
        return result;
    }
    let main_form = {
        let ptr = WindowsAndMessaging::GetWindowLongPtrW(h_wnd, WindowsAndMessaging::GWL_USERDATA)
            as *const MainForm;
        if ptr.is_null() {
            None
        } else {
            Some(&*ptr)
        }
    };
    main_form
        .and_then(|main_form| main_form.wndproc(h_wnd, msg, w_param, l_param))
        .unwrap_or_else(|| WindowsAndMessaging::DefWindowProcW(h_wnd, msg, w_param, l_param))
}

unsafe fn wndproc_pre(h_wnd: HWND, msg: u32, w_param: WPARAM, l_param: LPARAM) -> Option<LRESULT> {
    match msg {
        WindowsAndMessaging::WM_CREATE => {
            WindowsAndMessaging::SetWindowPos(
                h_wnd,
                None,
                0,
                0,
                0,
                0,
                WindowsAndMessaging::SWP_NOMOVE
                    | WindowsAndMessaging::SWP_NOSIZE
                    | WindowsAndMessaging::SWP_FRAMECHANGED,
            );
            Some(LRESULT(0))
        }
        WindowsAndMessaging::WM_NCCALCSIZE if w_param.0 != 0 => {
            let nccalcsize_params =
                &mut *(l_param.0 as *mut WindowsAndMessaging::NCCALCSIZE_PARAMS);
            let cx_frame = WindowsAndMessaging::GetSystemMetrics(WindowsAndMessaging::SM_CXFRAME);
            let cy_frame = WindowsAndMessaging::GetSystemMetrics(WindowsAndMessaging::SM_CYFRAME);
            let cx_padded_border =
                WindowsAndMessaging::GetSystemMetrics(WindowsAndMessaging::SM_CXPADDEDBORDER);
            nccalcsize_params.rgrc[0].right -= cx_frame + cx_padded_border;
            nccalcsize_params.rgrc[0].left += cx_frame + cx_padded_border;
            nccalcsize_params.rgrc[0].bottom -= cy_frame + cx_padded_border;
            Some(LRESULT(0))
        }
        WindowsAndMessaging::WM_DESTROY => {
            WindowsAndMessaging::PostQuitMessage(0);
            Some(LRESULT(0))
        }
        _ => None,
    }
}
