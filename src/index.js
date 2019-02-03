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

function render(element) {
  ReactDOM.render(element, document.querySelector('[data-react-preview-editor="preview"]'))
}

const defaultScope = {
  React,
  Fragment: React.Fragment,
  Component: React.Component,
  render,
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

export function Preview(props) {
  const { code, scope, transformCode, dispatch } = useContext(codeContext)
  useEffect(() => {
    let transformed = transformCode(code)
    const func = new Function(...Object.keys(scope), transformed)
    func(...Object.values(scope))
  }, [code, scope, transformCode])
  return <div {...props} data-react-preview-editor="preview" />
}

export function Editor({ getHighlighterProps, ...props }) {
  const { code, dispatch } = useContext(codeContext)

  return (
    <CodeEditor
      value={code}
      onValueChange={code => dispatch({ type: TYPES.EDIT, payload: code })}
      highlight={code => (
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
      )}
      {...props}
    />
  )
}

Editor.defaultProps = {
  getHighlighterProps(props) {
    return props
  },
}
