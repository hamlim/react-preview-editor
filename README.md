# React Preview Editor

React-Preview-Editor is a BYO live editor and preview for code. It is built on top of:

- `react-simple-code-editor` and
- `prism-react-renderer`

## Getting Started

Take a look at the CodeSandbox here: https://codesandbox.io/s/wk69q5zv9k. To set this up locally,
add the following:

```bash
yarn add @matthamlin/react-preview-editor react@16.8.0-alpha.1 react-dom@16.8.0-alpha.1
# or
npm add @matthamlin/react-preview-editor react@16.8.0-alpha.1 react-dom@16.8.0-alpha.1
```

**Optionally** Install `@babel/standalone` to transform JSX and future JavaScript features so the
code can run within your browser.

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

## Advanced Usage

`react-preview-editor` also exposes `useEditor` and `usePreview` hooks to build custom Editor and
Preview components.

### `useEditor`

The `useEditor` hook will provide you the following:

```js
const { value, onValueChange, highlight } = useEditor({ getHighlighterProps })
```

- `value` is the current code that the user is editing
- `onValueChange` is a function that handles taking in the raw code as a string and updating the
  state of the code the user has entered
- `highlight` is a function that is called with the `code` and returns a node that will be rendered
  to highlight the code

By default, `highlight` will return the Highlighter component from `prism-react-renderer`

- `getHighlighterProps` is a required argument, that should return an object of props, this will be
  provided to the Highlighter component returned from `highlight`

### `usePreview`

`usePreview` is an effectful hook, that will attempt to render the current code using the provided
`renderer`

```jsx
function Preview() {
  usePreview({ scope: { customVariableInScope: 5 }, render })
  return <div />
}
```

- `scope` is an object of additional variables exposed within the live preview code (this is
  shallowly merged with the default values documented below in Features)
- `render` is a function that calls `ReactDOM.render`, you can customize this by using the
  `createRenderer` export of the package where you provide a selector for an element that is
  provided to `document.querySelector`. Or you can provide a custom renderer here too.

## Features

By default, `react-preview-editor` adds the following to scope when evaluating the code to render in
the `Preview` component:

- `React`
- `Component`
- `Fragment`
- `useState`
- `useReducer`
- `useEffect`
- `useMemo`
- `useCallback`
- `useContext`
- Other values can be added to scope by providing an object to the `scope` prop on the Provider
  component
