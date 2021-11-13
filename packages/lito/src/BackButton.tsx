import styled from 'styled-components'
import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router'
const BackWrapper=styled.div`
position: absolute;
  top:0px;
  left: 0px;
  z-index: 100;
  width: 28px;
  height: 25px;
  padding-top: 5px;
  padding-left: 5px;
  background-color: transparent;
  &:hover{
    background-color: lightgray;
    
  }
  
`
const BackIcon=()=>{
  return <svg   className="icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="2484" width="20" height="20">
    <path
      d="M800 480H268.8l233.6-233.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-284.8 288c-12.8 12.8-12.8 32 0 44.8h3.2l284.8 288c6.4 6.4 16 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6 12.8-12.8 12.8-32 0-44.8L272 544H800c19.2 0 32-12.8 32-32s-16-32-32-32z"
       ></path>
  </svg>

}
export const BackButton=()=>{
  const back=()=>{
    window.history.back()
  }

  const history=useHistory();
  const { pathname } = useLocation();
  const show=useMemo(()=>{
    return pathname=='/'
  },[pathname])
if (show) return null;

return <BackWrapper onClick={back}>
  <BackIcon />
</BackWrapper>
}