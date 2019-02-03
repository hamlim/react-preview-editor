import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import { Provider, Editor, Preview } from './test'

const code = `
console.log(React);
function App() {
  const [count, setCount] = useState(0);
  return React.createElement('button', {
    onClick: () => setCount(count + 1),
    children: 'Update count ' + count 
  })
}
render(React.createElement(App));
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
          <Preview />
          <Editor />
        </Provider>
      </div>
    )
  }
}

export default App
