import styled from 'styled-components'
import { useCallback } from 'react'
import { Overlay, PlayButton } from '../ListenNow/Recommendation'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'

const Wrapper = styled.div`
  display: flex;
  margin: 0px 10px;
  padding: 15px;
  align-items: center;
  max-width: 300px;
  min-width: 250px;
  border-radius: 15px;
  background: rgba(229,229,229,0.75);
  //opacity: 0.75;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    opacity: 1;
  }

`
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    font-weight: 700;
    font-size: 1.2rem;

  }

  .subtitle {
    font-weight: 800;
    font-size: 0.8rem;
    opacity: 0.8;
    padding-top: 5px;
  }


`
const ImgWrapper=styled.div`
width: 100px;
  flex-shrink:0;
  position: relative;
  height: 100px;
  overflow: hidden;
border-radius: 10px;
  margin-right: 10px;


`
export const SearchRecord = ({ name,url,artistName,info,artworkurl,type,id }: any) => {
  const { push } = useHistory()
  const { t } = useTranslation()

  const play = useCallback(async (e) => {

    e.stopPropagation()


    console.log(type)
    if(type!='song'){

      push(`/${type}/${id}`)

    }else {
      if(!url) return
      const music = MusicKit.getInstance()
      await music.setQueue({ url })
      await music.play()
    }

  }, [])


  const artworkUrl = artworkurl.replace('{w}', '560').replace('{h}', '560').replace('{c}', 'cc').replace('{f}', 'webp')

  return (
    <Wrapper onClick={play} className={'FeatureCard'} >
      <ImgWrapper>
        <img src={artworkUrl} />
        <Overlay >
          <PlayButton type='button' onClick={play}>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 27'>
              <path
                d='M11.3545232,18.4180929 L18.4676039,14.242665 C19.0452323,13.9290954 19.0122249,13.1204156 18.4676039,12.806846 L11.3545232,8.63141809 C10.7603912,8.26833741 9.98471883,8.54889976 9.98471883,9.19254279 L9.98471883,17.8404645 C9.98471883,18.5006112 10.7108802,18.7976773 11.3545232,18.4180929 Z'/>
            </svg>
          </PlayButton>
        </Overlay>
      </ImgWrapper>
      <InfoWrapper>

        <span className='title'>
        {name}
      </span>
        <span className='subtitle'>
        {t(type+'s')+' - '+(artistName?artistName:name)}
      </span>
      </InfoWrapper>


    </Wrapper>
  )


}