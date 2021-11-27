import { useCallback } from 'react'
import { Overlay, PlayButton } from '../ListenNow/Recommendation'
import styled from 'styled-components'
import { addSearchHistory } from '../utils/localstorage'
const ResourceWrapper=styled.li`
display: flex;
  align-items:center;
  position: relative;
  padding: 10px;
  scroll-snap-align: start;

  img,.artworkImg{
    width: 40px;height: 40px;
    border-radius: 6px;
    margin-right: 15px;
    overflow: hidden;
  }
  svg{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 40px;
    height: 40px;
    z-index: 2;
    fill:#fff;
    transform:translate(-50%,-50%);
    
  }
  &:hover{
    .artworkImg div{
      opacity: 1;
  }
   
  }
`
const Title=styled.div`
  font-weight: 600;
  padding: 1px;
  
`
const SubTitle=styled.div`
opacity: 0.8;
  padding: 1px;

`
export const SongResource = ({value}:any) => {

  const { attributes,id } = value


  // console.log(value)
  if (!attributes) {
    throw new Error(`attributes not found in resource: ${JSON.stringify(value)}`)
  }
  const { artwork, url,  name,artistName,albumName } = attributes
  // TODO: some resource's artwork is optional, fallback to render the title?
  if (!artwork) {
    throw new Error(`artwork not found in resource: ${JSON.stringify(value)}`)
  }
  if (!url) {
    throw new Error(`url not found in resource: ${JSON.stringify(value)}`)
  }
  const addhistory=addSearchHistory();


  const artworkUrl = artwork.url.replace('{w}', '320').replace('{h}', '320').replace('{c}', 'cc').replace('{f}', 'webp')
  const play = useCallback(async () => {
    const music = MusicKit.getInstance()
    await music.setQueue({ url })
    await music.play()
    addhistory({type:'songs',id:id})
  }, [])
  return (
    <ResourceWrapper onClick={play}
    >
<div style={{'width':'40px','height':'40px','position':'relative'}} className={'artworkImg'}>
  <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt='' />
  <Overlay  style={{'width':'40px'}}>
    {/*<PlayButton>*/}
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 27'>
        <path
          d='M11.3545232,18.4180929 L18.4676039,14.242665 C19.0452323,13.9290954 19.0122249,13.1204156 18.4676039,12.806846 L11.3545232,8.63141809 C10.7603912,8.26833741 9.98471883,8.54889976 9.98471883,9.19254279 L9.98471883,17.8404645 C9.98471883,18.5006112 10.7108802,18.7976773 11.3545232,18.4180929 Z'></path>
      </svg>
    {/*</PlayButton>*/}
  </Overlay>
</div>
      <div>
        <Title >
          {name}
        </Title>
        <SubTitle>
          {artistName}
        </SubTitle>
      </div>

    </ResourceWrapper>
  )

}