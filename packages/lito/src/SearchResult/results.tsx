import styled from 'styled-components'
import { useLayoutEffect, useRef, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import SimpleErrorBoundary from '../SimpleErrorBoundary'
import { LeftButton, RecommendationProps, RightButton } from '../ListenNow/Recommendation'
import { useTranslation } from 'react-i18next'
import { ArtistResource } from './Artist'
import { AlbumResource } from './Album'

const Wrapper = styled.div`
  margin-bottom: 12px;
  padding: 0 40px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    .left-button, .right-button {
      opacity: 1;
    }
  }
`

const Header = styled.div`
  padding: 13px 0;
  font-size: 17px;
  line-height: 1.29412;
  font-weight: 600;

`

const ResourceListScroll = styled.div`
  margin: -15px;
  overflow: hidden;
  scroll-snap-type: x mandatory;

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
  grid-auto-flow: column;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

`

const ResultList = ({ value,name }: any) => {
  const { t } = useTranslation()
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
    let clientWidth1 = ResourceListDom.current!['clientWidth']
    // let offsetWidth1= ResourceListDom.current!['offsetWidth']
// console.log(clientWidth1,offsetWidth1)
    const { offsetWidth, clientWidth } = ResourceListScrollDom.current!
    // console.log(clientWidth,offsetWidth)
    setshowLeft(clientWidth + (ResourceListScrollDom.current as any).scrollLeft < clientWidth1)
    setshowRight((ResourceListScrollDom.current as any).scrollLeft > 20)
  }
  useLayoutEffect(() => {
    showButtons();
    (ResourceListScrollDom.current as any)?.addEventListener('scroll', showButtons)
    // (ResourceListScrollDom.current as any).addEventListener('resize', showButtons)


  }, [])
  useResizeObserver(ResourceListScrollDom,showButtons)
  let resourse;
  if(name=='artists')
    resourse=value.data.map((value:any) => (
      <ArtistResource key={value.id} value={value} />
    ))
  if(name=='albums')
    resourse=value.data.map((value:any) => (
      <AlbumResource key={value.id} value={value} />
    ))
  // if(name=='songs')
  //   resourse=value.data.map((value:any) => (
  //     <AlbumResource key={value.id} value={value} />
  //   ))
  return (
    <Wrapper>
      {showLeft ? (<LeftButton className='left-button' onClick={() => ScrollLeft(false)}>
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
      {showRight ? (<RightButton className='right-button' onClick={() => ScrollLeft(true)}>
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
      <Header>{t(name)}</Header>
      <SimpleErrorBoundary>
        <ResourceListScroll ref={ResourceListScrollDom}>

          <ResourceList ref={ResourceListDom}>

            {resourse}


          </ResourceList>
        </ResourceListScroll>
      </SimpleErrorBoundary>
    </Wrapper>
  )
}
export default ResultList
