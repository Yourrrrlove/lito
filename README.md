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

![image](https://user-images.githubusercontent.com/44310445/136697600-4c4c1100-14f4-4c54-877f-b8cb445aac54.png)

### Search

![image](https://user-images.githubusercontent.com/44310445/136697622-e9c5b484-0979-4f74-accb-195cc84a7445.png)

### Details

![image](https://user-images.githubusercontent.com/44310445/136697640-ebea8f29-2c8e-4180-997d-c69dcf03d1b2.png)

![image](https://user-images.githubusercontent.com/44310445/136697646-a2123920-eee3-4b9e-9ab1-65529566be43.png)

### Time-synced lyrics

<img src="https://user-images.githubusercontent.com/3000535/134794792-0f0a4a56-c95b-4b02-966c-cbb71c90df20.png" width="1000" alt="Lito Music (time-synced lyrics)" />

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
