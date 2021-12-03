import { useLocalStorage, usePlayerEventCallback } from '../utils/localstorage'
import { useEffect } from 'react'

export const usePersistPlaybackStates = () => {
  const [volume, setVolume] = useLocalStorage('player.volume', 1)

  usePlayerEventCallback(
    MusicKit.Events.playbackVolumeDidChange,
    () => {
      setVolume(MusicKit.getInstance().volume)
    },
    []
  )

  const [url, setURL] = useLocalStorage<string>('player.url','')
  const [index, setIndex] = useLocalStorage<number>('player.index', 0)
  const [repeat, setRepeat] = useLocalStorage<any>('player.repeat', {})

  usePlayerEventCallback(
    MusicKit.Events.nowPlayingItemDidChange,
    () => {
      const instance = MusicKit.getInstance()
      const url = (instance.nowPlayingItem as any)?.container.attributes?.url
      console.log((instance.nowPlayingItem as any)?.container.attributes?.url)
      // @ts-ignore
      if (window&&window.chrome&&window.chrome.webview&&window.chrome.webview.postMessage){
        // @ts-ignore
        window.chrome.webview.postMessage({ event: 'SongUpdate', duration: Math.ceil(instance.nowPlayingItem?.playbackDuration/1000) })

      }
      if (url) {
        setURL(url)
      }
      setIndex((instance as any).nowPlayingItemIndex || null)
    },
    []
  )
useEffect(()=>{
  const unload=()=>{
    const instance = MusicKit.getInstance()
    const repeatMode=instance.repeatMode;
    const shuffleMode=instance.shuffleMode;
    setRepeat({'repeatMode':repeatMode,'shuffleMode':shuffleMode})
  }
  window.addEventListener('beforeunload',unload)
  return ()=>{
    window.removeEventListener('beforeunload',unload)
  }

})
  useEffect(() => {
    const instance = MusicKit.getInstance()
    // @ts-ignore
    instance.volume = volume
    if (repeat!={}){
      instance.repeatMode=repeat['repeatMode']
      instance.shuffleMode=repeat['shuffleMode']
    }
    if (url) {
      instance.setQueue({ url, startPosition: index })
    }
  }, [])
}