import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import SimpleErrorBoundary from '../SimpleErrorBoundary'
import useResizeObserver from '@react-hook/resize-observer'
import { useHistory } from 'react-router'

export interface RecommendationProps {
  value: PersonalRecommendation
}

export interface PersonalRecommendation {
  id: string
  type: string
  href: string
  attributes: PersonalRecommendation.Attributes
  relationships: PersonalRecommendation.Relationships
}

export namespace PersonalRecommendation {
  export interface Attributes {
    kind: string
    nextUpdateDate: string
    reason: Attributes.Reason
    resourceTypes: string[]
    title: Attributes.Title
  }

  export namespace Attributes {
    export interface Reason {
      stringForDisplay: string
    }

    export interface Title {
      stringForDisplay: string
    }
  }

  export interface Relationships {
    contents: Relationships.PersonalRecommendationContentsRelationship
  }

  export namespace Relationships {
    export interface PersonalRecommendationContentsRelationship {
      href: string
      next: string
      data: any[]
    }
  }
}

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
`

const ResourceListScroll = styled.div`
  margin: -15px;
  overflow: hidden;

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
  scroll-behavior: smooth;

`
export const LeftButton = styled.div`
  margin-top: 48px;
  width: 36px;
  height: 160px;
  position: absolute;
  z-index: 2;
  right: -5px;

  opacity: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    opacity: 1;

  }
`
export const RightButton = styled.div`
  margin-top: 48px;
  width: 36px;
  height: 160px;
  position: absolute;
  z-index: 2;
  left: -5px;

  opacity: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    opacity: 1;

  }
`

const Recommendation = ({ value }: RecommendationProps) => {
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
      <Header>{value.attributes.title?.stringForDisplay}</Header>
      <SimpleErrorBoundary>
        <ResourceListScroll ref={ResourceListScrollDom}>

          <ResourceList ref={ResourceListDom}>
            {value.relationships.contents.data.map((value) => (
              <Resource key={value.id} value={value} />
            ))}
          </ResourceList>
        </ResourceListScroll>
      </SimpleErrorBoundary>
    </Wrapper>
  )
}

export default Recommendation

interface ResourceProps {
  value: any
}

export const ResourceWrapper = styled.div`
  scroll-snap-align: start;
  position: relative;
  background-color: var(--background-color);
  width: 160px;
  height: 160px;
  border-radius: 10px;
z-index: 2;
  box-shadow: 0 4px 14px rgb(0 0 0 / 10%);

  * {
    border-radius: 10px;
  }

  &:hover {
    div {

      display: block;

    }
    .shadow{
      display: block;
    }

  }
  .shadow{
    position: absolute;
    top: 8px;
    left: 0;
    z-index: -1;
    display:none;
    transition-duration:300ms;
    transition-delay:0ms;
    filter: blur(4px) opacity(.6);
    transform: scale(.92,.96);
    
  }
`
export const Title = styled.span`
  top: 20px;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: bold;
  //z-index: 10;
`
export const SubTitle = styled.span`
  bottom: 10px;
  position: absolute;
  left: 20px;
  right: 20px;
  text-align: center;
  font-weight: 600;
  line-height: 20px;
  white-space: pre-wrap;
  //z-index: 10;
`
export const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  background-color: rgba(51, 51, 51, 0.5);
  opacity: 0;
  transition: opacity 0.1s ease;

  &:hover {
    opacity: 1;
  }

  & {
    color: lightgray;
  }
`

export const PlayButton = styled.button`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  appearance: none;
  border: 0 none;
  padding: 0;
  background: none;
  position: relative;
  width: 60px;
  height: 60px;
  fill: #fff;
  backdrop-filter: blur(5px);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: #e63e44;
  }
`

const Resource = ({ value }: ResourceProps) => {
  const { attributes,type,id } = value
  // console.log(value)
  if (!attributes) {
    throw new Error(`attributes not found in resource: ${JSON.stringify(value)}`)
  }
  const { artwork, url, curatorName, name } = attributes
  // TODO: some resource's artwork is optional, fallback to render the title?
  if (!artwork) {
    throw new Error(`artwork not found in resource: ${JSON.stringify(value)}`)
  }
  if (!url) {
    throw new Error(`url not found in resource: ${JSON.stringify(value)}`)
  }
  const artworkUrl = artwork.url.replace('{w}', '320').replace('{h}', '320').replace('{c}', 'cc').replace('{f}', 'webp')
  const { push } = useHistory()
  const handleClick = useCallback(() => {
    if (type=='albums'){
      push(`/album/${id}`)
    }else if(type=='playlists'){
      push(`/playlist/${id}`)

    }
  }, [push,id])
  const play = useCallback(async () => {
    const music = MusicKit.getInstance()
    await music.setQueue({ url })
    await music.play()
  }, [])
  return (
    <ResourceWrapper
      style={
        {
          '--background-color': `#${artwork.bgColor}`
        } as React.CSSProperties


      }
      onClick={handleClick}
    >
      <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt='' />
      <Overlay>
        {/*<Title>*/}
        {/*  {curatorName}*/}
        {/*</Title>*/}
        <PlayButton type='button' onClick={play}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 27'>
            <path
              d='M11.3545232,18.4180929 L18.4676039,14.242665 C19.0452323,13.9290954 19.0122249,13.1204156 18.4676039,12.806846 L11.3545232,8.63141809 C10.7603912,8.26833741 9.98471883,8.54889976 9.98471883,9.19254279 L9.98471883,17.8404645 C9.98471883,18.5006112 10.7108802,18.7976773 11.3545232,18.4180929 Z'></path>
          </svg>
        </PlayButton>
        <SubTitle>
          {name}
        </SubTitle>

      </Overlay>

    </ResourceWrapper>
  )
}
