import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ArtistResource } from './Artist'
import { SongResource } from './Song'
const Header = styled.div`
  padding: 13px 0;
  font-size: 17px;
  line-height: 1.29412;
  font-weight: 600;

`
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
const Grid=styled.ul`
  margin-left: -15px;
  margin-top: -3px;
display: grid;
  align-items:start;
  list-style:none;
  grid-auto-flow:column;
  min-height:140px;
  padding-inline-start:0px;
  padding-block-start: -10px;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  position: relative;
  overflow-x: scroll;

`
export const SongGrid = ({ value,name }: any) => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Header>{t(name)}</Header>
<Grid className={'shelf-grid__list'}>
  {
    value.data.map((value:any) => (
      <SongResource key={value.id} value={value} />
    ))
  }
</Grid>
    </Wrapper>
      )
}