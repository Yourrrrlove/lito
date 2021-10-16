import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSetTheme } from '../GlobalThemeContext'
import { useTranslation } from 'react-i18next'
import { PlayIcon } from '../AlbumDetail'

export const ListContext = React.createContext({ visible: false, setVisible(value: boolean) {} })
export const useListContext = () => React.useContext(ListContext)
const Header = styled.div`
  padding: 13px 0;
  margin-left: 20px;
  font-size: 1.8em;
  line-height: 2;
  font-weight: 800;

`

const Wrapper = styled.div`
  position: fixed;
  padding-top: 50px;
  box-sizing: border-box;
  
  top: 0;
  right: 0;
  bottom: 0;
  width: 0;
  background: rgba(249, 249, 249, 0.96);
  z-index: 98;
  transition: width 0.5s cubic-bezier(0.4, 0, 1, 1);
  pointer-events: none;
  *{
    opacity: 0;
  }
  &.visible {
    pointer-events: initial;
    width: 25vw;
    //min-width: 300px;
    *{
      opacity: 1;
    }
  }
`
const TrackList=styled.div`
display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  
`
const Container=styled.div`
  display: flex;
  border-radius: 10px;
  width: 100%;
  align-items: center;
  padding: 10px 5px;
  box-sizing: border-box;

  svg {
    opacity: 0;
    color: #fa2138;
    z-index: 1;
    position: relative;
    left: -10px;
  }

  &.active {
    background-color: rgba(250, 130, 141, 0.75) !important;
  }

  &:hover {
    background: rgba(214, 0, 23, 0.15);

    svg {
      opacity: 1;
    }

  }


`
const TrackNumber=styled.div`
margin-right: 10px;
  opacity: 0.7;
  width: 25px;
  text-align: center;
`
const TrackDur=styled.span`
  margin-left: auto;
  margin-right: 10px;
  opacity: 0.7;
`
const TrackItem=({attributes,index,active}:any)=>{
  const {name,durationInMillis}=attributes
  const play = useCallback(async () => {
    // console.log(index)
    const music = MusicKit.getInstance()
    await music.changeToMediaAtIndex(index)
    // await music.play()
  }, [index])

  return(

    <Container onClick={play} className={active?'active':''}>
      <TrackNumber>
        {index+1}
      </TrackNumber>
      <span style={{'fontWeight':700}}>
      {name}
    </span>
      <TrackDur>
        {MusicKit.formatMediaTime(durationInMillis/1000,":")}
      </TrackDur>
    </Container>
  )
}
export const QueueList=()=>{
  const [playList, setPlayList] = useState([])
  const [playItem, setPlayItem] = useState(0)
  const music = MusicKit.getInstance()

  useEffect(()=>{
    function handlePlayListChange(e:any){
      // console.log(1)
      // console.log(1,e)
      setPlayList(e)
    }
    music.addEventListener('queueItemsDidChange',handlePlayListChange)

// @ts-ignore
    return ()=>music.removeEventListener('queueItemsDidChange',handlePlayListChange)
  },[music])
  useEffect(()=>{
    function handlePlayItemChange(e:any){
      console.log(1)
      console.log(1,e)
      setPlayItem(e['position'])
    }
    music.addEventListener('queuePositionDidChange',handlePlayItemChange)

// @ts-ignore
    return ()=>music.removeEventListener('queuePositionDidChange',handlePlayItemChange)
  },[music])
  const { visible } = useListContext()
  const {t} =useTranslation()
  // @ts-ignore
  // console.log(MusicKit.getInstance(),MusicKit.getInstance().queue)
  useEffect(()=>{
    // @ts-ignore
    const {position,items}=MusicKit.getInstance().queue
    // console.log(position,items)
    setPlayList(items)
    setPlayItem(position)
  },[])
  return (
    <Wrapper
      className={visible ? 'visible' : ''}>
      <Header>
        {t('playlists')}

      </Header>
<TrackList>
  {playList.map((v:MusicKit.MediaItem,i:number)=>
    <TrackItem attributes={v['attributes']} index={i} active={i==playItem}/>

  )}
</TrackList>

    </Wrapper>

)
}