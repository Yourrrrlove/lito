import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  
  padding: 20px;
  align-items: center;
  max-width: 500px;
  border-radius: 15px;
  background: #E5E5E5;
  opacity: 0.75;

  img {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
  }

`
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    font-weight: 800;
    font-size: 1.4rem;

  }

  .subtitle {
    font-weight: 800;
    font-size: 0.8rem;
    opacity: 1;
  }

  .info {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`
export const FeatureCard = ({ relationships }: any) => {
  if (!relationships || !relationships.children || relationships.children.data.length == 0) {
    return null
  }
  // console.log(relationships)
  const relationship = relationships.children.data[0].relationships
  const attributes = relationships.children.data[0].attributes
  // console.log(attributes, relationship)

  const { artwork, designBadge, designTag } = attributes

  const { name, url } = relationship.contents.data[0].attributes
  const artworkUrl = artwork.url.replace('{w}', '560').replace('{h}', '560').replace('{c}', 'cc').replace('{f}', 'webp')

  return (
    <Wrapper>
      <img src={artworkUrl} />
      <InfoWrapper>
      <span className='subtitle'>
        {designBadge}
      </span>
        <span className='title'>
        {name}
      </span>
        <span className='info'>
        {designTag}
      </span>
      </InfoWrapper>


    </Wrapper>
  )


}