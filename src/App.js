// @flow
import React, { Component } from 'react'
import styled from 'react-emotion'

import logo from './logo.svg'
import './App.css'
import MiniEditor from './editor/Editor'

export const AppName = styled('span')`
   position: absolute;
   display: block;
   text-align: left;
   font-weight: bold;
`

type Props = {};
class App extends Component<Props> {
   render() {
      return (
         <div className="App">
            <AppName>Mini Editor</AppName>
            <MiniEditor />
         </div>
      )
   }
}

export default App
