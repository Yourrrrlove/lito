import { useCallback } from 'react'
import { Overlay, PlayButton, ResourceWrapper, Title } from '../ListenNow/Recommendation'
import styled from 'styled-components'
import { useHistory } from 'react-router'
export const ArtistTitle = styled.span`
top: 50%;
  transform: translate(0, -50%);
  font-size: 18px;
  position: absolute;
  left: 20px;
  right: 20px;
  text-align: center;
  font-weight: 600;
  line-height: 20px;
  white-space: pre-wrap;
  //z-index: 10;
`
export const ArtistResource = ({value}:any) => {

    const { attributes,id } = value
  const { push } = useHistory()
  const handleClick = useCallback(() => {
    push(`/artist/${id}`)
  }, [push,id])

    // console.log(value)
    if (!attributes) {

      throw new Error(`attributes not found in resource: ${JSON.stringify(value)}`)

    }
    const { artwork, url,  name } = attributes
    // TODO: some resource's artwork is optional, fallback to render the title?
    if (!artwork) {
      return null;
      // throw new Error(`artwork not found in resource: ${JSON.stringify(value)}`)
    }
    if (!url) {
      throw new Error(`url not found in resource: ${JSON.stringify(value)}`)
    }
    const artworkUrl = artwork.url.replace('{w}', '320').replace('{h}', '320').replace('{c}', 'cc').replace('{f}', 'webp')

    return (
      <ResourceWrapper
        style={
          {
            '--background-color': `#${artwork.bgColor}`,
            'borderRadius':'50%'
          } as React.CSSProperties
        }
onClick={handleClick}
      >
        <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt='' />
        <Overlay>


          <ArtistTitle>
            {name}
          </ArtistTitle>

        </Overlay>

      </ResourceWrapper>
    )

}