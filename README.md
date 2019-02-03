# React Preview Editor

React-Preview-Editor is a BYO live editor and preview for code. It is built on top of:

- `react-simple-code-editor` and
- `prism-react-renderer`

## Getting Started

`yarn add @matthamlin/react-preview-editor @babel/standalone react@16.8.0-alpha.1 react-dom@16.8.0-alpha.1`

```jsx
import { Provider, Editor, Preview } from '@matthamlin/react-preview-editor'
import { transform } from '@babel/standalone'

function transformCode(code) {
  return transform(code, { presets: [['stage-0', { decoratorsLegacy: true }], 'react'] }).code
}

render(
  <Provider
    code={`function App() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Update count: {count}</button>
  );
}

render(<App />);`}
    transformCode={transformCode}
  >
    <Preview />
    <Editor />
  </Provider>,
)
```
