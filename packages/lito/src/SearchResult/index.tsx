import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import Nothing from '../Nothing'
import Recommendation from '../ListenNow/Recommendation'
import { useLocation, useParams } from 'react-router-dom'
import ResultList from './results'
import { SongGrid } from './SongGrid'
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
const SearchResults = () => {
  const { t } = useTranslation()
  let text= (useParams() as any)['text']
  console.log(text)
  if (text==undefined){
    return (
      <Wrapper>
        <Header>{t('searchResult')}</Header>
        {/*{error && <Nothing placeholder="fetchFailed" />}*/}
        {/*{recommendationList?.map((value: any) => (*/}
        {/*  <Recommendation key={value.id} value={value} />*/}
        {/*))}*/}
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