import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useReducer,
  useMemo,
  useCallback,
} from 'react'
import ReactDOM from 'react-dom'
import Highlight, { defaultProps } from 'prism-react-renderer'
import CodeEditor from 'react-simple-code-editor'

export function createRenderer(mountSelector = `[data-react-preview-editor="preview"]`) {
  return function render(element) {
    ReactDOM.render(element, document.querySelector(mountSelector))
  }
}

const defaultScope = {
  React,
  Fragment: React.Fragment,
  Component: React.Component,
  render: createRenderer(),
  useEffect,
  useContext,
  useState,
  useRef,
  useReducer,
  useMemo,
  useCallback,
}

const codeContext = React.createContext({
  code: '',
  scope: defaultScope,
  transformCode(code) {
    return code
  },
  dispatch() {},
})

const TYPES = {
  ERROR: 'error',
  EDIT: 'edit',
}

const initialState = { initialCode: '', code: '', error: null }

function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case TYPES.ERROR:
      return {
        ...state,
        error: payload,
      }
    case TYPES.EDIT:
      return {
        ...state,
        code: payload,
      }
    default: {
      return state
    }
  }
}

export function Provider({ code, transformCode, scope, children }) {
  const [state, dispatch] = useReducer(reducer, {
    code,
    initialCode: code,
    error: null,
  })

  const ctx = {
    ...state,
    scope: { ...defaultScope, ...scope },
    dispatch,
    transformCode,
  }
  return <codeContext.Provider value={ctx}>{children}</codeContext.Provider>
}

Provider.defaultProps = {
  transformCode(code) {
    return code
  },
  scope: defaultScope,
}

export function usePreview({
  render = createRenderer(`[data-react-preview-editor="preview"]`),
  scope: hookScope,
}) {
  const { code, scope, transformCode, dispatch } = useContext(codeContext)
  const resolvedScope = { ...scope, ...hookScope, render }
  useEffect(() => {
    let transformed = transformCode(code)
    const func = new Function(...Object.keys(resolvedScope), transformed)
    func(...Object.values(resolvedScope))
  }, [code, scope, transformCode])
}

export function Preview(props) {
  usePreview()
  return <div {...props} data-react-preview-editor="preview" />
}

export function useEditor({ getHighlighterProps }) {
  const { code, dispatch } = useContext(codeContext)

  return {
    value: code,
    onValueChange: code => dispatch({ type: TYPES.EDIT, payload: code }),
    highlight: code => (
      <Highlight
        {...getHighlighterProps({
          ...defaultProps,
          code,
          language: 'jsx',
        })}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <React.Fragment>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </React.Fragment>
        )}
      </Highlight>
    ),
  }
}

export function Editor({ getHighlighterProps, ...props }) {
  const editorProps = useEditor({ getHighlighterProps })

  return <CodeEditor {...editorProps} {...props} />
}

Editor.defaultProps = {
  getHighlighterProps(props) {
    return props
  },
}
