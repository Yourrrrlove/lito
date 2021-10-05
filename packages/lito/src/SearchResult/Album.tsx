import { useCallback } from 'react'
import { Overlay, PlayButton, ResourceWrapper, SubTitle, Title } from '../ListenNow/Recommendation'
import { useHistory } from 'react-router'

export const AlbumResource = ({value,noHover}:any) => {

  const { attributes,id } = value


  // console.log(value)
  if (!attributes) {
    throw new Error(`attributes not found in resource: ${JSON.stringify(value)}`)
  }
  const { artwork, url,  name ,artistName,} = attributes
  // TODO: some resource's artwork is optional, fallback to render the title?
  if (!artwork) {
    throw new Error(`artwork not found in resource: ${JSON.stringify(value)}`)
  }
  if (!url) {
    throw new Error(`url not found in resource: ${JSON.stringify(value)}`)
  }
  const artworkUrl = artwork.url.replace('{w}', '320').replace('{h}', '320').replace('{c}', 'cc').replace('{f}', 'webp')
  const play = useCallback(async () => {
    const music = MusicKit.getInstance()
    await music.setQueue({ url })
    await music.play()
  }, [])
  const { push } = useHistory()
  const handleClick = useCallback(() => {
    push(`/album/${id}`)
  }, [push,id])
  return (

    <ResourceWrapper onClick={handleClick}
      style={
  {
    '--background-color': `#${artwork.bgColor}`,
  } as React.CSSProperties
}
>

  <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt='' />
      <img src={artworkUrl} className={'shadow'} loading='lazy' width='100%' height='100%' alt='' />

      <Overlay >
      {noHover?null:(<Title>
        {artistName}
      </Title>)}
      <PlayButton type='button' onClick={play}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 27'>
          <path
            d='M11.3545232,18.4180929 L18.4676039,14.242665 C19.0452323,13.9290954 19.0122249,13.1204156 18.4676039,12.806846 L11.3545232,8.63141809 C10.7603912,8.26833741 9.98471883,8.54889976 9.98471883,9.19254279 L9.98471883,17.8404645 C9.98471883,18.5006112 10.7108802,18.7976773 11.3545232,18.4180929 Z'></path>
        </svg>
      </PlayButton>

      {noHover?null:(<SubTitle>
        {name}
    </SubTitle>)}

    </Overlay>

    </ResourceWrapper>
)

}