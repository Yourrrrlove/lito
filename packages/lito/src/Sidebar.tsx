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
  height: 60px;
  --app-region: drag;
  margin: 10px auto;
  color: #000;
  opacity: ${isMacOS() ? 0 : 1};
  width: 40px;
  text-align: center;
  svg{
    width: 0;
    height: 0;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`
const Logodiv=styled.div`
  background-image: linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);
  background-color: #f6f6f2;
  //background-attachment: fixed;
  -webkit-clip-path: url(#clipping);
  clip-path: url(#clipping);
  height: 60px;
  width: 100%;
  text-align: center;
  background-size: cover;
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
      <Logo >
        <svg xmlns="http://www.w3.org/2000/svg">
          <clipPath id="clipping">
              <path d="M17.6662 0.581876C17.6663 0.581899 17.6664 0.581922 17.6664 0.581945L32.814 6.32052C34.1896 6.84174 35.3759 7.77526 36.2136 8.99718C37.0514 10.2192 37.5004 11.6711 37.5 13.1587V13.1589V20.9998C37.4999 21.2106 37.4492 21.4181 37.3526 21.6044C37.2561 21.7907 37.1166 21.95 36.9465 22.0691C36.7765 22.1882 36.5809 22.2636 36.3764 22.2893C36.172 22.315 35.9643 22.2904 35.7711 22.2172L19.1772 15.9291L18.5 15.6724V16.3966V39.0001C18.4998 39.1098 18.486 39.2191 18.4587 39.3253L18.4498 39.3599L18.4459 39.3955C18.2272 41.4043 17.3535 43.2817 15.9635 44.7322C14.5736 46.1827 12.7466 47.1239 10.7705 47.4089C8.79443 47.6938 6.78044 47.3064 5.04552 46.3071C3.31049 45.3078 1.95265 43.753 1.18695 41.8867C0.421214 40.0203 0.291543 37.9491 0.818554 35.9998C1.34555 34.0506 2.49894 32.3349 4.09591 31.1223C5.69279 29.9099 7.64267 29.2692 9.63844 29.3002C11.6342 29.3313 13.5637 30.0323 15.123 31.2939L15.9375 31.953V30.9052V1.79943C15.9376 1.58855 15.9883 1.38107 16.0849 1.19477C16.1814 1.0085 16.3209 0.849187 16.491 0.730097C16.661 0.611026 16.8566 0.535604 17.0611 0.50988C17.2655 0.484165 17.4731 0.508816 17.6662 0.581876Z" fill="black" stroke="black"/>
          </clipPath>
        </svg>
        <Logodiv/>
      </Logo>
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
