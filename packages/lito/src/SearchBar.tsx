import styled from 'styled-components'
import { useCallback } from 'react'
import { useHistory } from 'react-router'

const SearchIcon = () => {
  return (
    <svg viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' fill='currentColor' width='16' height='16'>
      <path
        d='M705 641.36l193.66 193.66c17.572 17.572 17.572 46.066 0 63.64-17.574 17.572-46.068 17.572-63.64 0l-193.66-193.66C585.972 747.044 516.9 772 442 772c-182.254 0-330-147.746-330-330S259.746 112 442 112s330 147.746 330 330c0 74.9-24.954 143.974-67 199.36zM442 682c132.548 0 240-107.452 240-240s-107.452-240-240-240-240 107.452-240 240 107.452 240 240 240z'
        p-id='1187'></path>
    </svg>)
}
const Container=styled.div`
  height: 30px;
  //width: 200px;
  display: flex;
  //padding: 2px;
  padding-left: 8px;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 20px;
  background: rgba(209, 209, 214, 0.28);
  //box-sizing: border-box;
  border: solid  transparent 2px;

  &:active, &:focus, &:focus-within {
    border: solid  #fa2138 2px;
    //background: rgba(214, 0, 23, 0.15);
    //color: #fa2138;
  }

  input {
    //font-size: 16px;
    //font-weight: 600;
    color: inherit;
    border: none;
    background: transparent;

    ::placeholder {
      color: inherit;

    }

  }
`


const SearchBar=()=>{
  const { push } = useHistory()
  const handleClick = useCallback(() => {
    push('/search/')
  }, [push])
  const handleKeyDown=(e: {
    target: any
    key: string })=>{

    if(e.key=='Enter'){
      push('/search/'+e.target.value)
    }
  }
  return(
    <Container >
      <SearchIcon/>
      <input placeholder='搜索'  onClick={handleClick} onKeyDown={handleKeyDown}/>
    </Container>

  )
}
export default SearchBar