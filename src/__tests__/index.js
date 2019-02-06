import React from 'react'
import { render, cleanup } from 'react-testing-library'
import { Provider, Preview, Editor, usePreview, useEditor, createRenderer } from '../index.js'
import 'jest-dom/extend-expect'

afterEach(cleanup)

test('it renders', () => {
  expect(() =>
    render(
      <Provider code={'const a = "a"'}>
        <Editor />
      </Provider>,
    ),
  ).not.toThrow()
})

test('usePreview renders the output code to the provided element', () => {
  function CustomPreview() {
    usePreview({ render: createRenderer(`[data-testid="here"]`) })
    return <div data-testid="here" />
  }
  const { getByTestId } = render(
    <Provider
      code={`function Test(){ return 'Test'; };
render(React.createElement(Test));`}
    >
      <CustomPreview />
    </Provider>,
  )

  expect(getByTestId('here').textContent).toBe('Test')
})

test('useEditor gives me the appropriate props', () => {
  const code = 'const a = "a"'
  let props
  function CustomEditor() {
    props = useEditor({ getHighlighterProps: p => p })
    return null
  }
  render(
    <Provider code={code}>
      <CustomEditor />
    </Provider>,
  )

  expect(props.onValueChange).toBeDefined()
  expect(props.highlight).toBeDefined()
  expect(props.value).toEqual(code)
})
