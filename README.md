# React Preview Editor

React-Preview-Editor is a BYO live editor and preview for code. It is built on top of:

- `react-simple-code-editor` and
- `prism-react-renderer`

## Getting Started

Take a look at the CodeSandbox here: https://codesandbox.io/s/wk69q5zv9k. To set this up locally, add the following:

```bash
yarn add @matthamlin/react-preview-editor react@16.8.0-alpha.1 react-dom@16.8.0-alpha.1
# or 
npm add @matthamlin/react-preview-editor react@16.8.0-alpha.1 react-dom@16.8.0-alpha.1
```

**Optionally** Install `@babel/standalone` to transform JSX and future JavaScript features so the code can run within your browser.

Then import the components, and render them:

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

## Features

By default, `react-preview-editor` adds the following to scope when evaluating the code to render in the `Preview` component:

* `React`
* `Component`
* `Fragment`
* `useState`
* `useReducer`
* `useEffect`
* `useMemo`
* `useCallback`
* `useContext`
* Other values can be added to scope by providing an object to the `scope` prop on the Provider component
