import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useSetTheme } from './GlobalThemeContext'
import Nothing from './Nothing'
import { usePlaybackState, usePlayerRef } from './Player/ProgressControl'
import { darkTheme, lightTheme } from './themes'
import useLyrics, { LyricsLine } from './useLyrics'
import useNowPlayingItem from './useNowPlayingItem'

export const LyricsContext = React.createContext({
  visible: false, setVisible(value: boolean) {
  }
})

export const useLyricsContext = () => React.useContext(LyricsContext)

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-color: #000;
  z-index: 99;
  transition: opacity 0.5s ease;
  opacity: 0;
  pointer-events: none;
  &.visible {
    opacity: 1;
    pointer-events: initial;
  }
`

const BlurWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(300px);
  --app-region: drag;
  overflow: overlay;
  font-weight: bold;
  padding: 50vh 0;
  font-size: 24px;
  &::-webkit-scrollbar {
    width: 0;
  }
  p {
    width: fit-content;
    margin: 1.5em 20vw;
    color: #fff;
    line-height: 1.5em;
    background-clip: text;
    opacity: 0.4;
    transition: opacity 0.3s ease, filter 0.3s ease;
    --app-region: none;
  }
  &.blur-behind p {
    filter: blur(1px);
  }
  p:hover,
  p.active {
    opacity: 1;
    filter: none;
  }
`
export const sendLyrics = (lastline: string, thisline: string) => {
  console.log(lastline, thisline)
  // @ts-ignore
  if (!window.chrome || !window.chrome.webview || !window.chrome.webview.postMessage) {
    return
  }
  // @ts-ignore
  window.chrome.webview.postMessage({ event: 'LyricsUpdate', data: `${lastline}&##&${thisline}` })
}
const Lyrics = () => {
  const { visible } = useLyricsContext()
  const setTheme = useSetTheme()
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setTheme(darkTheme)
      }, 500)
    } else {
      setTheme(lightTheme)
    }
  }, [visible, setTheme])
  useEffect(() => {
    // @ts-ignore
    if (!window.chrome || !window.chrome.webview) return

    const Mhandler = async ({ data }: any) => {
      // console.log(234)
let instance=MusicKit.getInstance()
      console.log(data)
      if (data['event'] == -1) {
       await instance.skipToPreviousItem();
      } else if (data['event'] == 0) {
        // @ts-ignore
        if(!instance.isPlaying){
          await instance.play();
        }else{
          await instance.pause();
        }
      } else if (data['event'] == 1) {
        await instance.skipToNextItem();
      } else if (data['event'] == 2) {

      }


    }
    // console.log(234)
    // @ts-ignore
    // @ts-ignore
    window.chrome.webview.addEventListener('message', Mhandler)
    // @ts-ignore
    return () => window.chrome.webview.removeEventListener('message', Mhandler)

  }, [window])


  const nowPlayingItem = useNowPlayingItem()
  const playerRef = usePlayerRef()
  const { currentTime } = usePlaybackState()
  const { lyrics, error } = useLyrics()
  // TODO: Algorithm should be optimized.
  const currentTimeInMs = useMemo(() => {
    // if (!visible) return undefined
    if (currentTime === undefined) return undefined
    return currentTime * 1000 + 200
  }, [visible, currentTime])
  const activeIndex = useMemo(() => {
    if (currentTimeInMs === undefined) return undefined
    const lineIndex = lyrics?.lines.findIndex(({ begin, end }) => begin <= currentTimeInMs && currentTimeInMs <= end)
    if (lineIndex === -1) return undefined
    return lineIndex
  }, [currentTimeInMs])

  const ref = useRef<HTMLDivElement>(null)
  const [lastScrollAt, setLastScrollAt] = useState(0)
  const blurBehindDelayAfterScroll = 1000
  const [blurBehind, setBlurBehind] = useState(true)
  useEffect(() => {
    if (!playerRef) return
    playerRef.addEventListener('ended', () => {
      sendLyrics('', '')
    })
    return () => {
      playerRef.removeEventListener('ended', () => {
        sendLyrics('', '')
      })
    }
  }, [playerRef])
  useEffect(() => {
    if (activeIndex === undefined) return
    const wrapper = ref.current
    if (!wrapper) return
    const line = wrapper.getElementsByTagName('p')[activeIndex]
    sendLyrics(lyrics?.lines[activeIndex - 1]?.text ?? '', lyrics?.lines[activeIndex]?.text ?? '')
    if (line) {
      if (Date.now() - lastScrollAt >= blurBehindDelayAfterScroll) {
        line.scrollIntoView({ block: 'center', behavior: 'smooth' })
        setBlurBehind(true)
      }
    }
  }, [activeIndex, lastScrollAt])
  const handleWheel = useCallback(() => {
    setLastScrollAt(Math.floor(Date.now() / 100) * 100)
    setBlurBehind(false)
  }, [])


  const handleClick = useCallback(
    (index: number) => {
      if (!playerRef) return
      const line = lyrics?.lines[index]
      if (!line) return
      sendLyrics(lyrics?.lines[index - 1]?.text ?? '', lyrics?.lines[index]?.text ?? '')
      playerRef.currentTime = line.begin / 1000
    },
    [lyrics, playerRef]
  )
  return (
    <Wrapper
      className={visible ? 'visible' : ''}
      ref={ref}
      style={{
        backgroundImage: nowPlayingItem?.artworkURL
          ? `url('${nowPlayingItem.artworkURL
            .replace('{w}', '256')
            .replace('{h}', '256')
            .replace('{c}', 'cc')
            .replace('{f}', 'webp')}'`
          : 'none'
      }}
    >
      <BlurWrapper className={blurBehind ? 'blur-behind' : ''} onWheel={handleWheel}>
        {error && <Nothing />}
        {lyrics?.lines.map((line, index) => {
          return (
            <p key={index} className={index === activeIndex ? 'active' : ''} onClick={() => handleClick(index)}>
              {line.text}
            </p>
          )
        })}
      </BlurWrapper>
    </Wrapper>
  )
}

export default Lyrics
