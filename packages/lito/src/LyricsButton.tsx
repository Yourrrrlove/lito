import { useCallback } from 'react'
import styled from 'styled-components'
import { useLyricsContext } from './Lyrics'

const Wrapper = styled.div`
  position: relative;
  input[type='checkbox'] {
    width: 32px;
    height: 32px;
    margin: 0;
    appearance: none;
    & + img {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 1;
      pointer-events: none;
      width:24px;
      height:24px;
    }
    &:active + img,
    &:checked + img {
      filter: invert(100%);
    }
  }
`
import LyricsIcon from '../public/asserts/Lyrics.png'
const LyricsButton = () => {
  const { visible, setVisible } = useLyricsContext()
  const handleChange = useCallback(() => {
    setVisible(!visible)
  }, [visible, setVisible])
  return (
    <Wrapper>
      <input type="checkbox" checked={visible} onChange={handleChange} />
      <img src={LyricsIcon}/>

    </Wrapper>
  )
}

export default LyricsButton
