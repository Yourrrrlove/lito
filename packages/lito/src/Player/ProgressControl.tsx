import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import useNowPlayingItem from '../useNowPlayingItem'

export const usePlayerRef = () => {
  // Although we could use MusicKit's API to get the playback
  // progress, due to its precision, I would directly manipulate
  // the audio#apple-music-player element.
  const nowPlayingItem = useNowPlayingItem()
  const playerElement = useMemo(() => {
    void nowPlayingItem
    return document.querySelector<HTMLAudioElement>('audio#apple-music-player')
  }, [nowPlayingItem])

  return playerElement
}

export const usePlaybackState = () => {
  const playerRef = usePlayerRef()
  const [duration, setDuration] = useState<number | undefined>()
  const [currentTime, setCurrentTime] = useState<number | undefined>()
  useEffect(() => {
    const update = () => {
      setDuration(playerRef?.duration)
      setCurrentTime(playerRef?.currentTime)
      // @ts-ignore

    }
    update()
    const play = () => {

        // @ts-ignore
        if (!window.chrome || !window.chrome.webview || !window.chrome.webview.postMessage) {
          return
        }
        // @ts-ignore
      let param={ event: 'Play', time:Math.ceil(playerRef?.currentTime), duration:Math.ceil(playerRef?.duration)}
        console.log(param)
        // @ts-ignore
        window.chrome.webview.postMessage({ event: 'Play', time:Math.ceil(playerRef?.currentTime)})


    }
    const stop = () => {

      // @ts-ignore
      if (!window.chrome || !window.chrome.webview || !window.chrome.webview.postMessage) {
        return
      }
      // @ts-ignore
      window.chrome.webview.postMessage({ event: 'Stop', })


    }
    if (playerRef) {
      playerRef.addEventListener('durationchange', update)
      playerRef.addEventListener('timeupdate', update)
      playerRef.addEventListener('playing',  play)
      playerRef.addEventListener('ended',  stop)
      playerRef.addEventListener('pause',  stop)
      playerRef.addEventListener('error',  stop)
      return () => {
        playerRef.removeEventListener('durationchange', update)
        playerRef.removeEventListener('timeupdate', update)
        playerRef.removeEventListener('playing',  play)
        playerRef.removeEventListener('ended',  stop)
        playerRef.removeEventListener('pause',  stop)
        playerRef.removeEventListener('error',  stop)
      }
    }
  }, [playerRef])
  return { duration, currentTime }
}

const CurrentTime = styled.div`
  position: absolute;
  padding: 2px;
  left: 0;
  bottom: 3px;
  height: 12px;
  background-color: #fff;
  opacity: 0.8;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  line-height: 12px;
  transform: scale(0.85);
  transition: opacity 0.1s 0.3s ease;
  pointer-events: none;
`

const RemainingTime = styled(CurrentTime)`
  left: auto;
  right: 0;
`

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 20px;
  &:not(:hover) ${CurrentTime}, &:not(:hover) ${RemainingTime} {
    opacity: 0;
    transition: opacity 0.1s ease;
  }
`

const Slider = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  input[type='range'] {
    position: relative;
    top: 5px;
    display: block;
    width: 100%;
    height: 11px;
    margin: 0;
    --app-region: none;
    &,
    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
    }
    &::-webkit-slider-runnable-track {
      height: 3px;
      background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), rgba(0, 0, 0, 0.15);
      background-repeat: no-repeat;
      background-size: var(--progress, 0%) 100%;
      -webkit-appearance: none;
    }
    &::-webkit-slider-thumb {
      position: relative;
      width: 12px;
      height: 3px;
      background-color: #333;
      border-radius: 1px;
      opacity: 0;
      transition: transform 0.1s ease, opacity 0.1s ease;
    }
    &:hover::-webkit-slider-thumb {
      transform: scaleY(300%);
      opacity: 1;
    }
  }
`

const formatTime = (secs: number | undefined) => {
  if (secs === undefined || isNaN(secs) || secs === Infinity) {
    return '--:--'
  }
  const minutesPart = String(Math.floor(secs / 60))
  const secsPart = String(Math.floor(secs % 60)).padStart(2, '0')
  return `${minutesPart}:${secsPart}`
}

const ProgressControl = () => {
  const playerRef = usePlayerRef()
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const instance = MusicKit.getInstance()
    const update = () => {
      setDuration(instance.currentPlaybackDuration)
      setCurrentTime(instance.currentPlaybackTime)
      setRemainingTime(instance.currentPlaybackTimeRemaining)
      setProgress(instance.currentPlaybackProgress)
    }
    instance.addEventListener('playbackDurationDidChange', update)
    instance.addEventListener('playbackTimeDidChange', update)
    return () => {
      instance.removeEventListener('playbackDurationDidChange', update)
      instance.removeEventListener('playbackTimeDidChange', update)
    }
  }, [])
  const [shouldContinueToPlay, setShouldContinueToPlay] = useState(false)
  const handleSeekStart = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      if (event.button === 0 && playerRef && !playerRef.paused) {
        // pause during seeking and continue to play once seek ends
        playerRef?.pause()
        setShouldContinueToPlay(true)
      }
    },
    [playerRef]
  )
  const handleSeekEnd = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      if (event.button === 0 && shouldContinueToPlay) {
        playerRef?.play()
        setShouldContinueToPlay(false)
      }
    },
    [playerRef, shouldContinueToPlay]
  )
  const handleSeeking = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (playerRef) {
        playerRef.currentTime = +event.target.value
        // @ts-ignore
        // if (window&&window.chrome&&window.chrome.webview&&window.chrome.webview.postMessage){
        //   console.log(playerRef?.currentTime)
        //   // @ts-ignore
        //   window.chrome.webview.postMessage({ event: 'SongTimeChange', time: Math.ceil(playerRef?.currentTime) })
        //
        // }
      }
    },
    [playerRef]
  )
  return (
    <Wrapper>
      <CurrentTime>{formatTime(currentTime)}</CurrentTime>
      <RemainingTime>{formatTime(remainingTime)}</RemainingTime>
      <Slider>
        <input
          type="range"
          max={duration}
          step="any"
          value={currentTime}
          style={{
            ['--progress' as any]: progress * 100 + '%',
          }}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onChange={handleSeeking}
          disabled={duration === 0}
        />
      </Slider>
    </Wrapper>
  )
}

export default ProgressControl
