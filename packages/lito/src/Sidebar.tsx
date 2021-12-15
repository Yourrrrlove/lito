import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import logo from './logo.svg'
import NavButton from './NavButton'
import { isMacOS } from './utils'
import SearchBar from './SearchBar'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  background-color: ${isMacOS() ? 'transparent' : `rgba(249, 249, 249, 0.96)`};

  ul {
    flex: 1;
    min-height: 0;
    overflow: overlay;
  }

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin-left: 10px;
  }

  a {
    display: block;
    padding: 0 12px;
    color: inherit;
    font: inherit;
    line-height: 32px;
    text-decoration: none;
    border-radius: 5px;

    &.active {
      background-color: rgba(60, 60, 67, 0.1);
    }
  }
`

const Logo = styled.div`
  background: url(${logo}) center center no-repeat;
  background-size: 48px 48px;
  height: 60px;
  --app-region: drag;
  margin-bottom: 10px;
  color: #000;
  opacity: ${isMacOS() ? 0 : 1};
`
const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;

  img {
    margin-right: 10px;
  }

  span {
    line-height: 22px;
  }


`
const SettingWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  height: 28px;
  width: 28px;
  box-sizing: border-box;
  //padding:5px;
  display: flex;
  transition: all 300ms;
  transform-origin: center;
  &:hover{
    transform: rotate(180deg);

  }
`
const SettingIcon = () => {
  const {setVisible}=useSettingContext()


  return (
    <SettingWrapper onClick={()=>{setVisible(true)}}>
      <svg width='28' height='28' fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.927 1.116l1.401-.615a.75.75 0 0 1 .85.174 9.792 9.792 0 0 1 2.204 3.792.75.75 0 0 1-.271.825l-1.242.916a1.381 1.381 0 0 0 0 2.226l1.243.915a.75.75 0 0 1 .272.826 9.797 9.797 0 0 1-2.204 3.792.75.75 0 0 1-.848.175l-1.407-.617a1.38 1.38 0 0 0-1.926 1.114l-.169 1.526a.75.75 0 0 1-.572.647 9.518 9.518 0 0 1-4.406 0 .75.75 0 0 1-.572-.647l-.168-1.524a1.382 1.382 0 0 0-1.926-1.11l-1.406.616a.75.75 0 0 1-.849-.175 9.798 9.798 0 0 1-2.204-3.796.75.75 0 0 1 .272-.826l1.243-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.271-.826 9.793 9.793 0 0 1 2.204-3.792.75.75 0 0 1 .85-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65c.717-.159 1.45-.243 2.201-.252ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'
          fill='#212121' />
      </svg>

    </SettingWrapper>
  )
}
import partypopper from '/asserts/party-popper.png'
import radio from '/asserts/radio.png'
import { useSettingContext } from './Settings'

const Sidebar = () => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Logo />
      <ul>
        <li>
          <SearchBar />
        </li>
        <li>
          <NavButton to='/'>
            <FlexDiv><img src={partypopper} width={'22px'} height={'22px'} /><span>{t('listenNow')}</span></FlexDiv>
          </NavButton>
          <NavButton to='/radio'>
            <FlexDiv><img src={radio} width={'22px'} height={'22px'} /><span
              style={{ 'marginTop': '4px' }}>{t('radio')}</span></FlexDiv>
          </NavButton>
        </li>
      </ul>
      <SettingIcon />
    </Wrapper>
  )
}

export default Sidebar
