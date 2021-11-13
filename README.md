<h1 align="center">
  <a href="#readme">
    <img src="/logo.png" width="130" height="130" alt="Lito Music" /><br />
    Lito Music
  </a>
</h1>

<p align="center">
  English
  |
  <a href="README-cn.md">中文</a>
</p>

<p align="center">
  
  Built with MusicKit JS, Edge WebView2 (Rust Binding) and React, *<strong>Lito</strong>* Focus on Providing Modern Features of Apple Music on Windows Platform.
</p>

## 🥥 System requirements

- OS version ≥ Windows 10 / macOS 11.0.
- For Windows: Edge WebView2 runtime (pre-installed in Windows 10 Insider Preview and Windows 11).  
  If not installed, Lito Music will try to download and install it at the first launch.
- `Source Han Serif` Font is Prefered for better outlook.You can get it from [here](https://github.com/adobe-fonts/source-han-serif).

## 🥗 Downloads

> NOTE: Windows Defender might say the pre-compiled binary is a malware. It's just a false positive.
> Code signing could solve this issue; however, [the price](https://www.google.com/search?q=code+signing+certificates+price)
> is not friendly to an open source developer. If you are concerned about it, please feel free to [build it on your own machine](#build).

Pre-compiled binaries are available [here][releases].

Nightly binaries are [here](actions). Desktop Lyrics Feature is Only Enabled on `Lyrics_Desktop` Branch.




## 🍱  Features

### Listen now

![image](https://user-images.githubusercontent.com/44310445/137575542-f6801755-3c63-426d-a704-6edbf2afad01.png)

### Search

![image](https://user-images.githubusercontent.com/44310445/136697622-e9c5b484-0979-4f74-accb-195cc84a7445.png)

### Details

![image](https://user-images.githubusercontent.com/44310445/137575562-6082927b-76ac-4cbe-b218-999598ba12df.png)

![image](https://user-images.githubusercontent.com/44310445/137575691-3ccdd82f-cc74-4fc3-be60-bce48abaefb4.png)
### Time-synced lyrics

![image](https://user-images.githubusercontent.com/44310445/137575591-85736317-d17f-49d9-ad0d-5881239c0226.png)
### Radio
> Not Working with My Account. Test on your risk.

![image](https://user-images.githubusercontent.com/44310445/137575534-653ba362-4810-4e23-85dd-59623e4e5e9a.png)

### Desktop Lyrics （Windows Only)
> Some Codes From [@lujjjh](https://github.com/lujjjh/iLyrics). 
> This is still an `Alpha Feature`.

![image](https://user-images.githubusercontent.com/44310445/137617076-c65d04f7-5c51-404b-9c6a-3636cdbad013.png)

### Taskbar Thumb Button (Windows Only)
> This is still an `Alpha Feature`.

![image](https://user-images.githubusercontent.com/44310445/141638183-fecf1ed6-d400-408f-8875-a0b4cdce8364.png)


## 🍲 Build 

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
