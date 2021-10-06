import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useState } from 'react'
import { initReactI18next } from 'react-i18next'
import { HashRouter as Router, Route } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { SWRConfig } from 'swr'
import Authorize from './Authorize'
import ControlButtons from './ControlButtons'
import SetThemeContext from './GlobalThemeContext'
import resources from './i18n/resources.json'
import ListenNow from './ListenNow'
import Lyrics, { LyricsContext } from './Lyrics'
import Player from './Player'
import Sidebar from './Sidebar'
import { lightTheme } from './themes'
import useAuthorized from './useAuthorized'
import SearchResult from './SearchResult'
import { AlbumDetail } from './AlbumDetail'
import { ArtistDetail } from './ArtistDetail'
import { PlayListDetail } from './PlayListDetail'
import { ListContext, QueueList } from './PlayList/PlayList'
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

const Wrapper = styled.div`
  color: ${({ theme }) => theme.textColor};
  height: 100vh;
  display: flex;
  overflow: hidden;
`

const MainScroll = styled.div`
  position: relative;
  background-color: #fff;
  flex: 1;
  min-width: 0;
`

const Main = styled.div`
  box-sizing: border-box;
  padding-top: 60px;
  height: 100%;
  overflow: overlay;
`

const fetcher = async (url: string) => {
  const t=await MusicKit.getInstance().api.music(url)
  console.log(t)

  const {
    data: { data },
  } = t
  return data
}

const App = () => {
  const [theme, setTheme] = useState(lightTheme)
  const authorized = useAuthorized()
  const [lyricsVisible, setLyricsVisible] = useState(false)
  const [listVisible, setListVisible] = useState(false)

  return (
    <SetThemeContext.Provider value={setTheme}>
      <ThemeProvider theme={theme}>
        <SWRConfig
          value={{
            loadingTimeout: 10000,
            fetcher,
          }}
        >
          <LyricsContext.Provider value={{ visible: lyricsVisible, setVisible: setLyricsVisible }}>
            <ListContext.Provider value={{ visible: listVisible, setVisible: setListVisible }}>

            <Wrapper>
              <Router>
                <Sidebar />
                <MainScroll>
                  <Main>
                    {authorized ? (
                      <>
                        <Player />
                        <QueueList/>
                        <Route path="/" component={ListenNow} exact/>
                        <Route path="/search/:text" component={SearchResult} />
                        <Route path="/album/:id" component={AlbumDetail} />
                        <Route path="/artist/:id" component={ArtistDetail} />
                        <Route path="/playlist/:id" component={PlayListDetail} />

                        <Route path="/search" component={SearchResult} exact />

                      </>
                    ) : (
                      <Authorize />
                    )}
                  </Main>
                </MainScroll>
              </Router>
              <ControlButtons />
              <Lyrics />
            </Wrapper>

            </ListContext.Provider>
          </LyricsContext.Provider>

        </SWRConfig>
      </ThemeProvider>
    </SetThemeContext.Provider>
  )
}

export default App
