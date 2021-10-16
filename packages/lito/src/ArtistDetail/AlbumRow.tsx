import styled from 'styled-components'
import { useLayoutEffect, useRef, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import SimpleErrorBoundary from '../SimpleErrorBoundary'
import { LeftButton, RecommendationProps, RightButton } from '../ListenNow/Recommendation'
import { useTranslation } from 'react-i18next'
import { AlbumResource } from '../SearchResult/Album'

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
  font-size: 1.8em;
  line-height: 2;
  font-weight: 800;

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
  .AlbumWrapper{
    display: flex;
    position: relative;
    flex-direction: column;
    
    align-content: center;
    justify-content: flex-start;
    .title{
      font-size: 1.2em;
      font-weight: 800;
      line-height: 2em;
    }
  }
  &.AlbumHeader{
    display: grid !important;
    grid-template-columns: repeat(4, 1fr);
    width: calc(100% - 30px);
    
    .AlbumWrapper{
      overflow: hidden;
      border-radius: 8px;
      z-index: 2;
      min-width: 165px;
      //background:#E5E5E5;
      //border: lightgray 1px solid;
      &>img{
       z-index: -1; 
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
          opacity: 0.4;
          filter: blur(5px);
        
      }
    }
  }
`


const ResultList = ({ value,isHeader }: any) => {
  const ResourceListDom = useRef(null)
  const ResourceListScrollDom = useRef(null)
  const [showLeft, setshowLeft] = useState(false)
  const [showRight, setshowRight] = useState(false)

  const ScrollLeft = (flag: Boolean) => {
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
    (ResourceListScrollDom.current as any).addEventListener('scroll', showButtons)
    // (ResourceListScrollDom.current as any).addEventListener('resize', showButtons)


  }, [])
  useResizeObserver(ResourceListScrollDom,showButtons)
// console.log(value)
  return (
    <Wrapper>
      {showLeft ? (<LeftButton style={{'marginTop': '80px'}} className='left-button' onClick={() => ScrollLeft(false)}>
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
      {showRight ? (<RightButton className='right-button' style={{'marginTop': '80px'}} onClick={() => ScrollLeft(true)}>
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
      <Header>{value['attributes']['title']}</Header>
      <SimpleErrorBoundary>
        <ResourceListScroll ref={ResourceListScrollDom}>

          <ResourceList ref={ResourceListDom}  className={isHeader?'AlbumHeader':''}  >

            {value.data.map((value:any) => (
<div className={'AlbumWrapper'} >
            <AlbumResource key={value.id} value={value} noHover />
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
    </Wrapper>
  )
}
export default ResultList
