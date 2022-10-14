import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle, css } from 'styled-components'
import App from './App'

const GlobalStyle = createGlobalStyle`${css`
  body {
    margin: 0;
    color: #333;
    font-size: 13px;
    font-family: system-ui;
    background-color: transparent;
    -webkit-font-smoothing: antialiased;
  }

  input,
  textarea,
  button {
    --app-region: none;
  }

  :not(input):not(textarea) {
    cursor: default;
    user-select: none;
  }

  *:focus {
    outline: none;
  }

  button {
    height: 28px;
    padding: 0 10px;
    color: inherit;
    font: inherit;
    background-color: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 5px;
    appearance: none;

    &:active {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }

  #musickit-dialog-scrim {
    z-index: 1000;
  }
`}
`

;(async () => {
  await MusicKit.configure({
    developerToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IldlYlBsYXlLaWQifQ.eyJpc3MiOiJBTVBXZWJQbGF5IiwiaWF0IjoxNjY1NDE5MjgwLCJleHAiOjE2ODA5NzEyODAsInJvb3RfaHR0cHNfb3JpZ2luIjpbImFwcGxlLmNvbSJdfQ.v7Rivc4volhJ5k_mofxslfYHXhVMLtiK03x57k0pWSeBogqb1AKZVxlBZVdk9sNMze-IJYYBUOMcJGLIDTeEVA'  })

  ReactDOM.render(
    <React.StrictMode>
      <App />
      <GlobalStyle />
    </React.StrictMode>,
    document.getElementById('root')
  )
})()

document.addEventListener('mousedown', (e) => {
  if (e.button !== 1) return
  e.preventDefault()
  e.stopPropagation()
})
