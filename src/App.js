// @flow
import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import MiniEditor from './editor/Editor'

type Props = {};
class App extends Component<Props> {
   render() {
      return (
         <div className="App">
            <MiniEditor />
         </div>
      )
   }
}

export default App
