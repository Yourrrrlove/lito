fn main() {
    windows::build! {
        Microsoft::Web::WebView2::Win32::*,
        Windows::Win32::Foundation::{
            E_NOINTERFACE, E_POINTER, E_NOTIMPL, HINSTANCE, LRESULT, POINT, PWSTR, RECT, SIZE, S_OK,
        },
        Windows::Win32::Graphics::Direct2D::*,
        Windows::Win32::Graphics::Dwm::*,
        Windows::Win32::Graphics::Dxgi::*,
        Windows::Win32::Graphics::DirectWrite::*,
        Windows::Win32::Graphics::Gdi::{MonitorFromWindow, ScreenToClient},
        Windows::Win32::System::{
            Com::{CoInitializeEx, CoTaskMemAlloc, CoTaskMemFree, IBindStatusCallback, URLDownloadToCacheFileW},
            LibraryLoader::{FreeLibrary, LoadLibraryW, GetModuleHandleW, GetProcAddress},
            Threading::GetCurrentThreadId,
            WinRT::EventRegistrationToken,
        },
                Windows::Win32::System::SystemServices::*,


        Windows::Win32::UI::{
            Controls::{MARGINS, PBM_SETPOS, PBM_SETRANGE, WM_MOUSELEAVE},
            HiDpi::{GetDpiForMonitor, SetProcessDpiAwareness, PROCESS_DPI_AWARENESS},
            KeyboardAndMouseInput::{GetCapture, ReleaseCapture, SetCapture, SetFocus, TrackMouseEvent},
            Shell::{FOLDERID_LocalAppData, NIS_SHAREDICON, NOTIFYICONDATAW, NOTIFYICON_VERSION_4, NOTIFY_ICON_MESSAGE, SHCreateMemStream, SHGetKnownFolderPath, ShellExecuteW, Shell_NotifyIconW,THUMBBUTTON,ITaskbarList3,TaskbarList,THUMBBUTTONFLAGS,THBN_CLICKED,},
            WindowsAndMessaging::*,
            Animation::*,
        },
                Windows::Win32::System::Com::*,

        Windows::Win32::Graphics::Direct3D11::*,
        Windows::Win32::Graphics::DirectComposition::*,
    };
}
