import styled from 'styled-components'
import LyricsButton from './LyricsButton'
import { isMacOS } from './utils'
import { PlayListButton } from './PlayList/Icon'

const Wrapper = styled.div`
  position: fixed;
  right: 5px;
  top: 0;
  height: 60px;
  display: flex;
  align-items: ${isMacOS() ? 'center' : 'flex-end'};
  z-index: 100;
  --app-region: drag;
  > * {
    --app-region: none;
  }
`
const ControlButtons = () => {
  return (
    <Wrapper>
      <PlayListButton/>
      <LyricsButton />

    </Wrapper>
  )
}

export default ControlButtons
