import { useCallback } from 'react'
import { Overlay, PlayButton, ResourceWrapper, Title } from '../ListenNow/Recommendation'
import styled from 'styled-components'
const SubTitle = styled.span`
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

    const { attributes } = value


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
            'border-radius':'50%'
          } as React.CSSProperties
        }
      >
        <img src={artworkUrl} loading='lazy' width='100%' height='100%' alt='' />
        <Overlay>


          <SubTitle>
            {name}
          </SubTitle>

        </Overlay>

      </ResourceWrapper>
    )

}