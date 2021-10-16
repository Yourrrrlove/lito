<h1 align="center">
  <a href="#readme">
    <img src="/logo.svg" width="100" height="100" alt="Lito Music" /><br />
    Lito Music
  </a>
</h1>

<p align="center">
  English
  |
  <a href="README-cn.md">中文</a>
</p>

<p align="center">
  <strong>Lito (/laɪto/) Music</strong> is a lightweight Apple Music client for Windows and macOS,<br />
  built with MusicKit JS, Edge WebView2 / WKWebView and React.
</p>

## System requirements

- OS version ≥ Windows 10 / macOS 11.0.
- For Windows: Edge WebView2 runtime (pre-installed in Windows 10 Insider Preview and Windows 11).  
  If not installed, Lito Music will try to download and install it at the first launch.
- `Source Han Serif` Font is Prefered for better outlook.You can get it from [here](https://github.com/adobe-fonts/source-han-serif).

## Downloads

> NOTE: Windows Defender might say the pre-compiled binary is a malware. It's just a false positive.
> Code signing could solve this issue; however, [the price](https://www.google.com/search?q=code+signing+certificates+price)
> is not friendly to an open source developer. If you are concerned about it, please feel free to [build it on your own machine](#build).

Pre-compiled binaries are available [here][releases].

## Features

### Listen now

![image](https://user-images.githubusercontent.com/44310445/137575542-f6801755-3c63-426d-a704-6edbf2afad01.png)

### Search

![image](https://user-images.githubusercontent.com/44310445/136697622-e9c5b484-0979-4f74-accb-195cc84a7445.png)

### Details

![image](https://user-images.githubusercontent.com/44310445/137575562-6082927b-76ac-4cbe-b218-999598ba12df.png)

![image](https://user-images.githubusercontent.com/44310445/137575500-3408c8c4-04df-4b18-be60-a061c1c8d5d9.png)
### Time-synced lyrics

![image](https://user-images.githubusercontent.com/44310445/137575591-85736317-d17f-49d9-ad0d-5881239c0226.png)
### Radio
> Not Working with My Account. Test on your risk.

![image](https://user-images.githubusercontent.com/44310445/137575534-653ba362-4810-4e23-85dd-59623e4e5e9a.png)

## Build

### For Windows

Visual Studio (with Windows 10 SDK), Rust and Node.js are required.

```powershell
npm install
npm run build:windows
```

### For macOS

Xcode and Node.js are required.

```sh
npm install
npm run build:darwin
```

[releases]: https://github.com/lujjjh/lito/releases
