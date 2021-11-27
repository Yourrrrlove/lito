import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import Nothing from '../Nothing'
import Recommendation from '../ListenNow/Recommendation'
import { useLocation, useParams } from 'react-router-dom'
import ResultList from './results'
import { SongGrid } from './SongGrid'
import { useLocalStorage } from '../utils/localstorage'
import { SearchRecord } from './SearchRecord'
const Wrapper = styled.div`
  padding-bottom: 32px;
`
const Header = styled.div`
  margin: 32px 40px 16px;
  font-size: 34px;
  
  font-weight: 600;
`
const SearchFetcher = async (url: string) => {
  const {
    data: { results },
  } = await MusicKit.getInstance().api.music(url)
  console.log(results)
  return results
}
const ListWrapper=styled.div`
  margin-left: 30px;
  display: flex;
  //grid-row-gap: 20px;
  width: 80%;
`
const SearchResults = () => {
  const { t } = useTranslation()
  let text= (useParams() as any)['text']
  console.log(text)
  if (text==undefined){
    const [history, setHistory] = useLocalStorage<any[]>('player.history', [])
    let records={songs:[],artists:[],albums:[]};
    history.forEach(value => {
      // @ts-ignore
      records[value['type']].push(value['id'])

    })
    // console.log(records)
    const { data: ResultLists, error } = useSWR(
      () => {
        const qs = new URLSearchParams()
        records.songs.length>0?qs.set('ids[songs]', records.songs.join(",")):null
        records.artists.length>0?qs.set('ids[artists]', records.artists.join(",")):null
        records.albums.length>0?qs.set('ids[albums]', records.albums.join(",")):null

        qs.set('fields', 'artwork,previewArtwork,artistName,url,name,playParams')
        qs.set('l', 'zh-cn')
        qs.set('platform','web')
        return `v1/catalog/cn/?${qs.toString()}`
      }
    )
    return (
      <Wrapper>
        <Header>{t('searchRecord')}</Header>
        <ListWrapper>
        {error && <Nothing placeholder="fetchFailed" />}
        {ResultLists?.map((value: any) =>{
          const {id,type,attributes}=value;
          const {url,name,artistName,artwork} = attributes
         return (


            <SearchRecord key={value.id} id={id} artistName={artistName} type={type.substring(0,type.length-1)} url={url} name={name} artworkurl={artwork['url']} />
          )
        } )}</ListWrapper>
      </Wrapper>
    )

  }
  // MusicKit.getInstance().api.search(text,{limit:25,types:['albums','artists','songs']})
  const { data: ResultLists, error } = useSWR(
    () => {
      const qs = new URLSearchParams()
      qs.set('term', text)
      qs.set('limit', '25')
      qs.set('l', 'zh-cn')
      qs.set('platform','web')

      qs.set('types', 'albums,artists,songs')
      return `v1/catalog/cn/search?${qs.toString()}`
    },
    SearchFetcher
  )
  console.log(ResultLists,error)
  return (
    <Wrapper>
      <Header>{t('searchResult')}</Header>
      {error && <Nothing placeholder="fetchFailed" />}
      {ResultLists?(
        <><ResultList key={ResultLists['artists']['href']} value={ResultLists['artists']} name={'artists'} /><ResultList
          key={ResultLists['albums']['href']} value={ResultLists['albums']} name={'albums'} />
          <SongGrid key={ResultLists['songs']['href']} value={ResultLists['songs']} name={'songs'} />

        </>

      ):null}
    </Wrapper>
  )
}

export default SearchResults