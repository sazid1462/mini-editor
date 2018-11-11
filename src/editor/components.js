import React from 'react'
import styled from 'react-emotion'

export const Button = styled('span')`
  cursor: pointer;
  color: ${props =>
      props.reversed
         ? props.active ? 'white' : '#aaa'
         : props.active ? 'black' : '#ccc'};
`

export const Input = styled('input')`
`

export const Icon = styled(({ className, ...rest }) => {
   return <span className={`material-icons ${className}`} {...rest} />
})`
  font-size: 18px;
  vertical-align: text-bottom;
`

export const Menu = styled('div')`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`

export const Toolbar = styled(Menu)`
   position: fixed;
   padding: 15px 0px 10px;
   margin: -20px -20px;
   border-bottom: 2px solid #bfbfbf;
   z-index: 100;
   margin-bottom: 20px;
   width: 100%;
   display: block;
   height: 30px;
`