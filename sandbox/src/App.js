import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import { Provider, Editor, Preview } from '@matthamlin/react-preview-editor'

const code = `
let count = 0;
`

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>

        <Provider code={code}>
          <Editor />
        </Provider>
      </div>
    )
  }
}

export default App
