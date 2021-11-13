import styled from 'styled-components'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useCallback } from 'react'
import Nothing from '../Nothing'
import Player from '../Player'
import { Overlay } from '../ListenNow/Recommendation'
import { ArtistResource } from '../SearchResult/Artist'
import { useHistory } from 'react-router'

const Wrapper = styled.div`
  padding-bottom: 32px;
  padding-left: 20px;
`
const HeadWrapper=styled.div`
  display: flex;
  padding: 50px;
  img{
    border-radius: 20px;
    height: 300px;
    width: 300px;
  }
  
  
`
const DetailsWrapper=styled.div`
display: flex;
  flex-direction: column;
  margin-left: 30px;
  margin-top: 25px;
  p{
    font-size: 1.2em;
    max-height: 280px;
    overflow-y: hidden;
  }
  
`
const ImgWrapper=styled.div`
position: relative;
overflow: visible;
  z-index: 2;
  height: 300px;
  width: 300px;
  display: block;
.shadow{
  position: absolute;
  top: 12px;
  left: 0;
  opacity: 0.4;
  filter: blur(4px);
  z-index: -1;
}
`

const TrackList=styled.div`
display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 80px;
  margin-left: 20px;
  margin-right: 20px;
`
const Title = styled.span`
  font-size: 2em;
  font-weight: 700;
`
const ControlWrapper=styled.div`
  margin-top: auto;
  margin-bottom: 10px;
  display: flex;
  font-weight: 600;
  
`
const PlayButton=styled.div`
  border-radius: 6px;
  height: 20px;
  display: flex;
  padding: 10px 20px;
  color: aliceblue;
  background-color: #f86676;
  align-items: center;
  justify-content: center;
`
const SubTitle = styled.span`
  font-weight: 700;
  font-size: 1.8em;

  color:  #fa2138 ;
`

const SubSubTitle = styled.span`
  font-weight: lighter;
  font-size: 1.2em;
  opacity: 0.8;
`
const ArtistsGrid=styled.div`
display: flex;
  width: 100%;
  margin-top: 20px;
  flex-wrap: wrap;
  &>div{
    margin-right: 20px;
    margin-top: 20px;

  }
`
export const PlayListDetail=()=>{

  // const { t } = useTranslation()
  let id= (useParams() as any)['id']
  console.log(id)

  const { data: infos, error } = useSWR(
    () => {
      const qs = new URLSearchParams()
      qs.set('l', 'zh-cn')
      qs.set('platform', 'web')
      qs.set('views', 'featured-artists')
      qs.set('extend', 'artistUrl,')
      qs.set('include', 'tracks')
      qs.set('include[songs]', 'artists')
      qs.set('fields[artists]', 'name,url,artwork')
      return `v1/catalog/cn/playlists/${id}?${qs.toString()}`
    },
  )
  console.log(error)
  console.log(infos)

  const Info=infos?.[0]
  const playA = useCallback(async () => {
    if(!Info) return
    const music = MusicKit.getInstance()
    await music.setQueue({ url })
    await music.play()
  }, [Info])
  if(!Info){
    return <Nothing placeholder="loading" />
  }

  const { attributes,relationships } = Info
  const {artists,tracks}=relationships
  if (!attributes) {
    throw new Error(`attributes not found in resource: ${JSON.stringify(Info)}`)
  }
  const { artwork, url,  name ,curatorName,editorialNotes} = attributes
  const artworkUrl = artwork.url.replace('{w}', '400').replace('{h}', '400').replace('{c}', 'cc').replace('{f}', 'webp')
const IncludedArtists=Info.views['featured-artists']
  return (
    <Wrapper>
      <HeadWrapper>
<ImgWrapper>
  <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt=''/>
  <img src={artworkUrl} className={'shadow'} loading='lazy' width='100%' height='100%' alt=''/>

</ImgWrapper>
        <DetailsWrapper>
          <Title>
            {name}
          </Title>
          <SubTitle>
            {curatorName}
          </SubTitle>
          <p>
            {editorialNotes?.short}
          </p>
          <ControlWrapper>
            <PlayButton onClick={playA}>
              <PlayIcon/>
              播放
            </PlayButton>
          </ControlWrapper>
        </DetailsWrapper>

      </HeadWrapper>
<TrackList>
  {tracks.data.map((v:any)=>
  <TrackItem  key={v.id} attributes={v['attributes']} relationships={v['relationships']}/>
  )}
</TrackList>

<Title style={{'marginTop':'40px','display':'block'}}>
  专辑中的艺术家
</Title>
<ArtistsGrid>
  {IncludedArtists['data'].map((v:any)=><ArtistResource key={v.id} value={v} />)}
</ArtistsGrid>
    </Wrapper>
  )
}

const Container=styled.div`
display: flex;
  border-radius: 10px;
  width: 100%;
  align-items: center;
  padding: 10px 15px;
  box-sizing: border-box;

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
    background: rgba(214, 0, 23, 0.15);
    .artworkImg div{
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
const TrackInfo=styled.div`
  display: grid;
  width: auto;
  flex: auto;
  grid-template-columns: repeat(3, 1fr);
  span{

  }
`


const TrackDur=styled.span`
  position: relative;
  right: 10px;
  margin-left: 10px;
  margin-right: 10px;
  opacity: 0.7;
  width: 40px;
  flex-grow: 0!important;
  

`

export const PlayIcon=()=>{
  return(
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 27' width={32} height={32} fill={'currentColor'}>
      <path
        d='M11.3545232,18.4180929 L18.4676039,14.242665 C19.0452323,13.9290954 19.0122249,13.1204156 18.4676039,12.806846 L11.3545232,8.63141809 C10.7603912,8.26833741 9.98471883,8.54889976 9.98471883,9.19254279 L9.98471883,17.8404645 C9.98471883,18.5006112 10.7108802,18.7976773 11.3545232,18.4180929 Z'></path>
    </svg>
  )
}
const ArtistJump=({artist}:any)=>{
  const { push } = useHistory()
  const ToArtist= useCallback(() => {
    push(`/artist/${artist['id']}`)
  }, [push,artist])
  return(
    <a onClick={ToArtist}>
      {artist.attributes.name}
    </a>
  )


}
const TrackItem=({attributes,relationships}:any)=>{
  // console.log(relationships)
 const {trackNumber,name,url,artwork,durationInMillis,artistName,albumName}=attributes
  const {artists}=relationships
  const play = useCallback(async () => {
    const music = MusicKit.getInstance()
    await music.setQueue({ url })
    await music.play()
  }, [])
  // console.log(attributes)
  const artworkUrl = artwork.url.replace('{w}', '320').replace('{h}', '320').replace('{c}', 'cc').replace('{f}', 'webp')

  return(
  <Container onClick={play}>

    <div style={{'width':'40px','height':'40px','position':'relative'}} className={'artworkImg'}>
      <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt='' />
      <Overlay >
        {/*<PlayButton>*/}
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 27'>
          <path
            d='M11.3545232,18.4180929 L18.4676039,14.242665 C19.0452323,13.9290954 19.0122249,13.1204156 18.4676039,12.806846 L11.3545232,8.63141809 C10.7603912,8.26833741 9.98471883,8.54889976 9.98471883,9.19254279 L9.98471883,17.8404645 C9.98471883,18.5006112 10.7108802,18.7976773 11.3545232,18.4180929 Z'></path>
        </svg>
        {/*</PlayButton>*/}
      </Overlay>
    </div>
    <TrackInfo>
    <span style={{'fontWeight':700}}>
      {name}
    </span>
    <span style={{'fontWeight':700}}>
      {artists.data.map((v:any)=><ArtistJump artist={v}/>)}
    </span>
    <span style={{'fontWeight':700}}>
      {albumName}
    </span></TrackInfo>
    <TrackDur>
      {MusicKit.formatMediaTime(durationInMillis/1000,":")}
    </TrackDur>
  </Container>
)
}