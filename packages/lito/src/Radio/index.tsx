import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useSWR from 'swr'
import Nothing from '../Nothing'
import { FeatureCard } from './FeatureCard'
import { useLayoutEffect, useRef, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import { LeftButton, RightButton } from '../ListenNow/Recommendation'
import SimpleErrorBoundary from '../SimpleErrorBoundary'
import { AlbumResource } from '../SearchResult/Album'

const Wrapper = styled.div`
  //padding-bottom: 32px;
  margin: 20px 20px;
`
const SubWrapper = styled.div`
  margin-bottom: 12px;
  padding: 0 40px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  .AlbumWrapper{
    max-width: 180px!important;
  }
  &:hover {
    .left-button, .right-button {
      opacity: 1;
    }
  }
  .subHeader {
    padding: 13px 0;
    font-size: 17px;
    line-height: 1.29412;
    font-weight: 600;
    
  }
`
export  const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-row-gap: 30px;
  width: 100%;
  padding-left: 30px;
  margin-top: 20px;
  margin-bottom: 20px;

`
const Header = styled.div`
  margin: 32px 40px 16px;
  font-size: 34px;
  font-weight: 500;
`
// const radioFetcher =
export const Radio = () => {
  const { t } = useTranslation()
  const { data: radio, error } = useSWR(
    () => {
      const offset = new Date().getTimezoneOffset(),
        o = Math.abs(offset)
      const tz = (offset < 0 ? '+' : '-') + ('00' + Math.floor(o / 60)).slice(-2) + ':' + ('00' + (o % 60)).slice(-2)
      const qs = new URLSearchParams()
      qs.set('platform', 'web')
      qs.set('name', 'radio')
      qs.set('tabs', 'subscriber')
      qs.set('extend', 'subscriber')
      qs.set('include[stations]', 'events')
      return `v1/editorial/cn/groupings?${qs.toString()}`
    },
    {
      refreshInterval: 7200000
    }
  )
  if (!radio) return (<Nothing />)
  // console.log(radio)
  const data = radio[0].relationships.tabs.data[0].relationships.children.data
  const features = data.filter((v: any) => {
    return !v['attributes']['name']
  })
  console.log(data)
  return (
    <Wrapper>
      <Header>{t('radio')}</Header>
      {error && <Nothing placeholder='fetchFailed' />}
      <FeatureGrid>
        {
          features.map((v: any) => {
            if (!v['attributes']['name'])
            {
              if (!v.relationships || !v.relationships.children || v.relationships.children.data.length == 0) {
                return null
              }
              // console.log(relationships)
              const relationship = v.relationships.children.data[0].relationships
              const attributes = v.relationships.children.data[0].attributes
              // console.log(attributes, relationship)

              const { artwork, designBadge, designTag } = attributes

              const { name, url } = relationship.contents.data[0].attributes
              return <FeatureCard  key={v['id']} name={name} artworkurl={artwork.url} url={url} subtitle={designBadge} info={designTag} />

            }else {
              return null
            }

          })
        }
      </FeatureGrid>
      {
        data.map((v: any) => {
if(!v['attributes']['name']||!v['relationships']) return null;
return (<ResultList attributes={v['attributes']} relationships={v['relationships']} />)
        })
      }

    </Wrapper>
  )
}
const ResultList = ({ attributes,relationships }: any) => {
  const ResourceListDom = useRef(null)
  const ResourceListScrollDom = useRef(null)
  const [showLeft, setshowLeft] = useState(false)
  const [showRight, setshowRight] = useState(false)

  const ScrollLeft = (flag: Boolean) => {
    if (ResourceListDom.current==null||ResourceListScrollDom.current==null)
      return
    const { offsetWidth, clientWidth } = ResourceListScrollDom.current!
    if (flag) {
      (ResourceListScrollDom.current as any).scrollTo({
        left: Math.floor(((ResourceListScrollDom.current as any).scrollLeft  / (160 + 20)) - Math.floor(clientWidth / (160 + 20))) * (160 + 20),
        behavior: 'smooth'
      })
    } else {
      (ResourceListScrollDom.current as any).scrollTo({
        left: Math.floor(((ResourceListScrollDom.current as any).scrollLeft / (160 + 20)) + Math.floor(clientWidth / (160 + 20))) * (160 + 20),
        behavior: 'smooth'
      })
    }

    // },0)
  }
  const showButtons = () => {
    if (ResourceListDom.current==null||ResourceListScrollDom.current==null)
      return
    if (!relationships||!relationships.contents||!ResourceListDom.current) return null;
    let clientWidth1 = ResourceListDom.current!['clientWidth']
    // let offsetWidth1= ResourceListDom.current!['offsetWidth']
// console.log(clientWidth1,offsetWidth1)
    const { offsetWidth, clientWidth } = ResourceListScrollDom.current!
    // console.log(clientWidth,offsetWidth)
    setshowLeft(clientWidth + (ResourceListScrollDom.current as any).scrollLeft < clientWidth1)
    setshowRight((ResourceListScrollDom.current as any).scrollLeft > 20)
  }
  useLayoutEffect(() => {
    if(!ResourceListScrollDom.current) return
    showButtons();
    (ResourceListScrollDom.current as any)?.addEventListener('scroll', showButtons)
    // (ResourceListScrollDom.current as any).addEventListener('resize', showButtons)


  }, [])
  useResizeObserver(ResourceListScrollDom,showButtons)
  // console.log(value)
if (!relationships||!relationships.contents) return null;
const {name} =attributes;
const data=relationships.contents.data;
  return (

    <SubWrapper>
      {showLeft ? (<LeftButton style={{'marginTop': '60px'}} className='left-button' onClick={() => ScrollLeft(false)}>
        <svg  className='icon' viewBox='0 0 1024 1024' version='1.1'
              xmlns='http://www.w3.org/2000/svg' p-id='2488' width='24' height='24'>
          <path
            d='M318.57 223.95l322.99 322.99c21.87 21.87 57.33 21.87 79.2 0 21.87-21.87 21.87-57.33 0-79.2l-323-322.99c-21.87-21.87-57.33-21.87-79.2 0-21.86 21.87-21.86 57.33 0.01 79.2z'
            fill='#666666' p-id='2489'></path>
          <path
            d='M729.75 555.95L406.76 878.93c-21.87 21.87-57.33 21.87-79.2 0-21.87-21.87-21.87-57.33 0-79.2l322.99-322.99c21.87-21.87 57.33-21.87 79.2 0 21.87 21.88 21.87 57.34 0 79.21z'
            fill='#666666' p-id='2490'></path>
        </svg>
      </LeftButton>) : null}
      {showRight ? (<RightButton className='right-button' style={{'marginTop': '60px'}} onClick={() => ScrollLeft(true)}>
        <svg  transform='rotate(180)' className='icon' viewBox='0 0 1024 1024' version='1.1'
              xmlns='http://www.w3.org/2000/svg' p-id='2488' width='24' height='24'>
          <path
            d='M318.57 223.95l322.99 322.99c21.87 21.87 57.33 21.87 79.2 0 21.87-21.87 21.87-57.33 0-79.2l-323-322.99c-21.87-21.87-57.33-21.87-79.2 0-21.86 21.87-21.86 57.33 0.01 79.2z'
            fill='#666666' p-id='2489'></path>
          <path
            d='M729.75 555.95L406.76 878.93c-21.87 21.87-57.33 21.87-79.2 0-21.87-21.87-21.87-57.33 0-79.2l322.99-322.99c21.87-21.87 57.33-21.87 79.2 0 21.87 21.88 21.87 57.34 0 79.21z'
            fill='#666666' p-id='2490'></path>
        </svg>
      </RightButton>) : null}
      <span className={'subHeader'}>{name}</span>
      <SimpleErrorBoundary>
        <ResourceListScroll ref={ResourceListScrollDom}>

          <ResourceList ref={ResourceListDom} >

            {data.map((value:any) => (
              <div className={'AlbumWrapper'} key={value.id} >
                <AlbumResource  value={value} noHover noAlbum  />
                <span className={'title'}>
    {value['attributes']['name']}
  </span>
                <span className={'subtitle'}>
    {value['attributes']['editorialNotes']?.short}
  </span>

              </div>

            ))}

          </ResourceList>
        </ResourceListScroll>
      </SimpleErrorBoundary>
    </SubWrapper>
  )
}

const ResourceListScroll = styled.div`
  margin: -15px;
  overflow: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding: 17px;
  &:hover {
    overflow: overlay;
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`

const ResourceList = styled.div`
  padding: 15px;
  display: grid;
  grid-row: 1;
  width: fit-content;
  gap: 20px;
  scroll-padding: 20px;
  grid-auto-flow: column;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  .AlbumWrapper{
    display: flex;
    position: relative;
    flex-direction: column;
    
    align-content: center;
    justify-content: flex-start;
    .title{
      font-size: 1.2em;
      font-weight: 800;
      //line-height: 2em;
    }
    .subtitle{
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      display: -webkit-box;
      
    }
  }

`