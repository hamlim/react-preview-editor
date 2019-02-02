# React Preview Editor

A live editor with a preview for code!

## Getting Started

`yarn add @matthamlin/react-preview-editor @babel/standalone react@16.8.0-alpha.1 react-dom@16.8.0-alpha.1`

```jsx
import { Provider, Editor, Preview } from '@matthamlin/react-preview-editor'

render(
  <Provider
    code={`function App() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>Update count: {count}</button>
  );
}

render(<App />);`}
  >
    <Preview />
    <Editor />
  </Provider>,
)
```

## TODO:

- [ ] See if it works
- [ ] Error handling
- [ ] Contribution guidelines
