import styled from 'styled-components'
import { useCallback } from 'react'
import { useListContext } from './PlayList'

const Wrapper = styled.div`
  position: relative;
  z-index: -1;
  input[type='checkbox'] {
    width: 32px;
    height: 32px;
    margin: 0;
    appearance: none;
    & + svg {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 1;
      pointer-events: none;
    }
    &:active + svg,
    &:checked + svg {
      color:#fa2138;
    }
  }
`
export const PlayListButton = () => {
  const { visible, setVisible } = useListContext()
  const handleChange = useCallback(() => {
    setVisible(!visible)
  }, [visible, setVisible])
  return (
    <Wrapper>
      <input type="checkbox" checked={visible} onChange={handleChange} />
      <svg className="icon"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         width="24" height="24" fill="currentColor">
        <path
          d="M682.666667 222.72V725.333333c0 2.56-0.213333 4.992-0.64 7.424A149.333333 149.333333 0 1 1 597.333333 611.712V170.666667a42.666667 42.666667 0 0 1 51.029334-41.813334l213.333333 42.666667A42.666667 42.666667 0 0 1 896 213.333333v170.666667a42.666667 42.666667 0 0 1-51.029333 41.813333l-74.368-14.848a42.666667 42.666667 0 1 1 16.725333-83.669333l23.338667 4.693333V248.32l-128-25.6zM533.333333 810.666667a64 64 0 1 0 0-128 64 64 0 0 0 0 128zM170.666667 341.333333a42.666667 42.666667 0 1 1 0-85.333333h298.666666a42.666667 42.666667 0 0 1 0 85.333333H170.666667z m0 170.666667a42.666667 42.666667 0 0 1 0-85.333333h298.666666a42.666667 42.666667 0 0 1 0 85.333333H170.666667z m0 170.666667a42.666667 42.666667 0 0 1 0-85.333334h128a42.666667 42.666667 0 0 1 0 85.333334H170.666667z"
          p-id="1187"></path>
      </svg>
    </Wrapper>
  )
}