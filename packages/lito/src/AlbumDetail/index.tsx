import styled from 'styled-components'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useCallback } from 'react'
import Nothing from '../Nothing'

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
export const AlbumDetail=()=>{

  const { t } = useTranslation()
  let id= (useParams() as any)['id']
  console.log(id)
  const { data: infos, error } = useSWR(
    () => {
      const qs = new URLSearchParams()
      qs.set('l', 'zh-cn')
      qs.set('platform', 'web')
      return `v1/catalog/cn/albums/${id}?${qs.toString()}`
    },
  )
  console.log(error)
  console.log(infos)

  const Info=infos?.[0]
  if(!Info){
    return <Nothing placeholder="loading" />
  }
  const { attributes,relationships } = Info
  const {artists,tracks}=relationships
  if (!attributes) {
    throw new Error(`attributes not found in resource: ${JSON.stringify(Info)}`)
  }
  const { artwork, url,  name ,artistName,genreNames,editorialNotes} = attributes
  const artworkUrl = artwork.url.replace('{w}', '400').replace('{h}', '400').replace('{c}', 'cc').replace('{f}', 'webp')

  return (
    <Wrapper>
      <HeadWrapper>
        <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt=''/>
        <DetailsWrapper>
          <Title>
            {name}
          </Title>
          <SubTitle>
            {artistName}
          </SubTitle>
          <SubSubTitle>
            {genreNames.join(' · ')}
          </SubSubTitle>
          <p>
            {editorialNotes?.short}
          </p>
        </DetailsWrapper>

      </HeadWrapper>
<TrackList>
  {tracks.data.map((v:any)=>
  <TrackItem  key={v.id} attributes={v['attributes']}/>
  )}
</TrackList>


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
  svg{
    opacity: 0;
    color: #fa2138;
    z-index: 1;
    position: relative;
    left: -10px;
    
  
  }
  &:hover{
    background: rgba(214, 0, 23, 0.15);  
    svg{
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

const PlayIcon=()=>{
  return(
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 27' width={32} height={32} fill={'currentColor'}>
      <path
        d='M11.3545232,18.4180929 L18.4676039,14.242665 C19.0452323,13.9290954 19.0122249,13.1204156 18.4676039,12.806846 L11.3545232,8.63141809 C10.7603912,8.26833741 9.98471883,8.54889976 9.98471883,9.19254279 L9.98471883,17.8404645 C9.98471883,18.5006112 10.7108802,18.7976773 11.3545232,18.4180929 Z'></path>
    </svg>
  )
}
const TrackItem=({attributes}:any)=>{
 const {trackNumber,name,url,durationInMillis}=attributes
  const play = useCallback(async () => {
    const music = MusicKit.getInstance()
    await music.setQueue({ url })
    await music.play()
  }, [])
return(
  <Container onClick={play}>
<PlayIcon/>
    <TrackNumber>
{trackNumber}
    </TrackNumber>
    <span style={{'fontWeight':580}}>
      {name}
    </span>
    <TrackDur>
      {MusicKit.formatMediaTime(durationInMillis/1000,":")}
    </TrackDur>
  </Container>
)
}