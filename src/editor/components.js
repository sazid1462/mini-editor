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
   position: relative;
   padding: 0px 18px 10px;
   margin: 0px -20px;
   border-bottom: 2px solid #bfbfbf;
   margin-bottom: 20px;
`