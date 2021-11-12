import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useCallback } from 'react'
import useSWR from 'swr'
import Nothing from '../Nothing'
import { PlayIcon } from '../AlbumDetail'
import AlbumRow from './AlbumRow'
import { SongGrid } from '../SearchResult/SongGrid'
import { FeatureGrid } from '../Radio'
import { FeatureCard } from '../Radio/FeatureCard'

const Wrapper = styled.div`
  padding-bottom: 32px;
  padding-left: 20px;
`
const HeadWrapper=styled.div`
  height: 300px;
  padding: 50px 20px 10px 20px;
  margin-left: -20px;
  
  position: relative;
  background: linear-gradient(transparent 0,rgba(0, 0, 0, 0.05));
`
const ImgWrapper=styled.div`
position: relative;
  overflow: visible;
  z-index: 2;
  margin-top: 30px;
  width: 180px;
  height: 180px;
  margin-left: auto;
  margin-right: auto;
  .shadow{
    position: absolute;
    top: 12px;
    left: 0;
    opacity: 0.4;
    filter: blur(8px) opacity(.6);
    z-index: -1;
  }
  img{
    position: absolute;
    top: 0;
    border-radius: 50%;
    width: 180px;
    height: 180px;
  }
  
`
const PlayWrapper=styled.div`
position: relative;
  bottom: -20px;
  left: 10px;
  display: flex;
  align-content: center;
  span{
    font-weight: 700;
    font-size: 1.8em;
  }
  .playButton{
    display: inline-block;
    background-color: #fa2138;
    border-radius: 50%;
    height: 32px;
    width: 32px;
    color: aliceblue;
    margin-right: 10px;
  }
`
export const ArtistDetail=()=>{
  let id= (useParams() as any)['id']
  console.log(id)

  const { data: infos, error } = useSWR(
    () => {
      const qs = new URLSearchParams()
      qs.set('l', 'zh-cn')
      qs.set('platform', 'web')
      qs.set('include','default-playable-content')
      qs.set('views', 'featured-albums,top-songs,full-albums')
      qs.set('limit[artists:top-songs]', '50')
      qs.set('limit[artists:full-albums]', '100')

      return `v1/catalog/cn/artists/${id}?${qs.toString()}`
    },
  )
  console.log(error)
  console.log(infos)
  let url='';
  const playA =  async () => {

    const music = MusicKit.getInstance()
    console.log(url)
    await music.setQueue({ url })
    await music.play()
  }
  const Info=infos?.[0]
  console.log(Info)

  if(!Info){
    return <Nothing placeholder="loading" />
  }
  const { attributes,relationships,views } = Info
  const defaultPlay=relationships['default-playable-content']?.data
 console.log(defaultPlay)
  if (defaultPlay){
    url=defaultPlay[0]['attributes']['url']
    console.log(url)
  }

  if (!attributes) {
    throw new Error(`attributes not found in resource: ${JSON.stringify(Info)}`)
  }
  const { artwork,   name ,genreNames,editorialNotes} = attributes
  // url=attributes['url']
  const artworkUrl = artwork.url.replace('{w}', '400').replace('{h}', '400').replace('{c}', 'cc').replace('{f}', 'webp')

  return (
    Info?
    <Wrapper>
      <HeadWrapper>
        <ImgWrapper>
          <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt=''/>
          <img src={artworkUrl} className={'shadow'} loading='lazy' width='100%' height='100%' alt=''/>

        </ImgWrapper>
<PlayWrapper>
  <div className={'playButton'} onClick={playA}>
    <PlayIcon/>

  </div>
  <span>
{name}
  </span>
</PlayWrapper>
      </HeadWrapper>
      {
        views['featured-albums']['data'].length>0? <FeatureGrid className={'FeatureGrid'} style={{'paddingLeft':'0px'}}>
          {views['featured-albums']['data'].map((v:any)=>{
            console.log(2,v)
            const {artistName,artwork,editorialNotes,name}=v.attributes
          return   <FeatureCard id={v['id']} key={v['id']} isAlbum={true} name={name} subtitle={artistName} artworkurl={artwork.url} info={editorialNotes?.short} />
          })}
        </FeatureGrid>:null
      }

      <AlbumRow value={views['full-albums']}/>
      <SongGrid value={views['top-songs']}/>

    </Wrapper>:<Nothing/>
  )
}