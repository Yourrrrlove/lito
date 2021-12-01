use std::ptr;
use std::ptr::null_mut;
use std::sync::atomic::{AtomicBool, Ordering};
use bindings::Windows::Win32::UI::Shell::THUMBBUTTONFLAGS;
use bindings::Windows::Win32::{
    Foundation::HWND,Foundation::PWSTR,
    UI::{Shell, WindowsAndMessaging},
};
use bindings::Windows::Win32::System::Com::{CoCreateInstance,CLSCTX_ALL,CoInitializeEx};
use bindings::Windows::Win32::Foundation::HINSTANCE;
use bindings::Windows::Win32::System::Com::CLSCTX_INPROC_SERVER;
use bindings::Windows::Win32::UI::WindowsAndMessaging::LoadIconW;
pub struct NotificationIcon {
    h_wnd: HWND,
    callback_message: Option<u32>,
    visible: AtomicBool,
}

impl NotificationIcon {
    pub fn new(h_wnd: HWND, callback_message: Option<u32>) -> Self {
        Self {
            h_wnd,
            callback_message,
            visible: AtomicBool::new(false),
        }
    }

    pub fn show(&self, visible: bool) {
        match self
            .visible
            .compare_exchange(!visible, visible, Ordering::SeqCst, Ordering::SeqCst)
        {
            Ok(_) => {
                let h_wnd = self.h_wnd;
                let mut tip: [u16; 128] = unsafe { std::mem::zeroed() };
                if visible {
                    let tip_vec = "Lito Music".encode_utf16().collect::<Vec<u16>>();
                    tip[..tip_vec.len()].copy_from_slice(&tip_vec);
                    let mut nid = Shell::NOTIFYICONDATAW {
                        cbSize: std::mem::size_of::<Shell::NOTIFYICONDATAW>() as u32,
                        hWnd: h_wnd,
                        uFlags: Shell::NIF_ICON | Shell::NIF_TIP,
                        hIcon: unsafe {
                            std::mem::transmute(WindowsAndMessaging::GetClassLongPtrW(
                                h_wnd,
                                WindowsAndMessaging::GCL_HICON,
                            ))
                        },
                        szTip: tip,
                        dwStateMask: Shell::NIS_SHAREDICON,
                        Anonymous: unsafe { std::mem::transmute(Shell::NOTIFYICON_VERSION_4) },
                        ..Default::default()
                    };
                    if let Some(callback_message) = self.callback_message {
                        nid.uCallbackMessage = callback_message;
                        nid.uFlags |= Shell::NIF_MESSAGE;
                    }
                    unsafe {
                        Shell::Shell_NotifyIconW(Shell::NIM_ADD, &nid);

                    }


                } else {
                    let nid = Shell::NOTIFYICONDATAW {
                        cbSize: std::mem::size_of::<Shell::NOTIFYICONDATAW>() as u32,
                        hWnd: h_wnd,
                        ..Default::default()
                    };
                    unsafe {
                        Shell::Shell_NotifyIconW(Shell::NIM_DELETE, &nid);
                    }
                };
            }
            Err(_) => {}
        }
    }
}
pub fn TaskBarUpdate(h_wnd: HWND, h_instance:HINSTANCE, t_type:i32)  {
    let mut nulltip: [u16; 260] = unsafe { std::mem::zeroed() };

    match t_type {
        1 =>{
            let mut taskbarButton1 =Shell::THUMBBUTTON{
                iId: 2009162001 as u32,
                dwMask: Shell::THB_ICON,
                hIcon: unsafe {LoadIconW(h_instance, PWSTR(101u32 as _))},
                iBitmap: 0 as u32,//24849
                szTip: nulltip,
                dwFlags: THUMBBUTTONFLAGS::default()

            };
            let  buttons=[taskbarButton1,];
            unsafe {
                let taskbar:Shell::ITaskbarList3= CoCreateInstance(&Shell::TaskbarList,None, CLSCTX_INPROC_SERVER).unwrap();
                println!("{:?}",taskbar.ThumbBarUpdateButtons(
                    h_wnd,
                    1u32,
                    buttons.as_ptr()

                ).unwrap());
                println!("{:?}",taskbar.SetOverlayIcon(
                    h_wnd,
                    LoadIconW(h_instance, PWSTR(106u32 as _)),
                    PWSTR(0 as _)
                ).unwrap());

            }

        }
        2 =>{
            let mut taskbarButton1 =Shell::THUMBBUTTON{
                iId: 2009162001 as u32,
                dwMask: Shell::THB_ICON,
                hIcon: unsafe {LoadIconW(h_instance, PWSTR(102u32 as _))},
                iBitmap: 0 as u32,//24849
                szTip: nulltip,
                dwFlags: THUMBBUTTONFLAGS::default()

            };
            let  buttons=[taskbarButton1,];
            unsafe {
                let taskbar:Shell::ITaskbarList3= CoCreateInstance(&Shell::TaskbarList,None, CLSCTX_INPROC_SERVER).unwrap();
                println!("{:?}",taskbar.ThumbBarUpdateButtons(
                    h_wnd,
                    1u32,
                    buttons.as_ptr()

                ).unwrap());
                println!("{:?}",taskbar.SetOverlayIcon(
                    h_wnd,
                    LoadIconW(h_instance, PWSTR(107u32 as _)),
                    PWSTR(0 as _)
                ).unwrap());

            }

        }
        _ => {}
    }

}

pub fn TaskBar(h_wnd: HWND,h_instance:HINSTANCE){
    let mut nulltip: [u16; 260] = unsafe { std::mem::zeroed() };

    let mut taskbarButton1 =Shell::THUMBBUTTON{
        iId: 2009162001 as u32,//24849
        dwMask: Shell::THB_ICON,
        hIcon: unsafe {LoadIconW(h_instance, PWSTR(102u32 as _))},
        iBitmap: 0 as u32,//24849
        szTip: nulltip,
        dwFlags: THUMBBUTTONFLAGS::default()

    };
    let mut taskbarButton2 =Shell::THUMBBUTTON{
        iId: 2009162002 as u32, //24850
        dwMask: Shell::THB_ICON,
        hIcon:  unsafe {LoadIconW(h_instance, PWSTR(104u32 as _))},
        iBitmap: 0 as u32,
        szTip: nulltip,
        dwFlags: THUMBBUTTONFLAGS::default()
    };
    let mut taskbarButton3 =Shell::THUMBBUTTON{
        iId: 2009162003 as u32,//24851
        dwMask: Shell::THB_ICON,
        hIcon:  unsafe {LoadIconW(h_instance, PWSTR(105u32 as _))},
        iBitmap: 0 as u32,
        szTip: nulltip,
        dwFlags: THUMBBUTTONFLAGS::default()
    };
    // let mut taskbarButton4 =Shell::THUMBBUTTON{
    //     iId: 2009162004 as u32,//24852
    //     dwMask: Shell::THB_ICON | Shell::THB_FLAGS,
    //     hIcon:  unsafe {LoadIconW(h_instance, PWSTR(101u32 as _))},
    //     iBitmap: 0 as u32,
    //     szTip: nulltip,
    //     dwFlags:  Shell::THBF_HIDDEN,
    // };
    let  buttons=[taskbarButton2,taskbarButton1,taskbarButton3,];


    unsafe {
        let taskbar:Shell::ITaskbarList3= CoCreateInstance(&Shell::TaskbarList,None, CLSCTX_INPROC_SERVER).unwrap();
        println!("{:?}",taskbar.ThumbBarAddButtons(
            h_wnd,
            3u32,
            buttons.as_ptr()

        ).unwrap());
        // taskbar.Release()

        // println!("{:?}",taskbar.ThumbBarUpdateButtons(
        //     h_wnd,
        //     2u32,
        //     buttons.as_ptr()
        //
        // ).unwrap());

    }
}
impl Drop for NotificationIcon {
    fn drop(&mut self) {
        self.show(false);
    }
}
