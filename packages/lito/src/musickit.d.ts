declare namespace MusicKit {
  interface API {
    music(request_uri: string): Promise<any>
  }

  interface Events {
    mediaItemStateDidChange: unknown,
    nowPlayingItemDidChange: unknown

  }

  const Events: {
    [key in keyof Events]: key
  }

  interface MusicKitInstance {
    shuffleMode: number;
    repeatMode: number;
    volume: number | ((val: number) => number);
    nowPlayingItem: MediaItem | undefined
    currentPlaybackDuration: number
    currentPlaybackProgress: number
    currentPlaybackTime: number
    currentPlaybackTimeRemaining: number
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'apple-music-artwork': any
    'apple-music-playback-controls': any
    'apple-music-progress': any
    'apple-music-volume': any
  }
}
