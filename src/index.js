import React, { useEffect, useContext, useState, useRef, useReducer, useMemo } from 'react'
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
        code: payload.code,
      }
    default: {
      return state
    }
  }
}

export function Provider({ code, transformCode, scope, children }) {
  const [state, dispatch] = useReducer(reducer, {
    initialCode: code,
    error: null,
  })

  const ctx = {
    ...state,
    code,
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
  const { code, scope, transformCode, dispatch, error } = useContext(codeContext)
  useEffect(() => {
    if (error) {
      return
    }
    let transformed = transformCode(code)
    const func = new Function(...Object.keys(scope), transformed)
    try {
      func(Object.values(scope))
    } catch (error) {
      dispatch({ type: TYPES.ERROR, payload: error })
    }
  }, [code, scope, transformCode, error])
  return <div {...props} data-react-preview-editor="preview" />
}

export function Editor(props) {
  const { code, dispatch } = useContext(codeContext)

  return (
    <CodeEditor
      value={code}
      onValueChange={code => dispatch({ type: TYPES.EDIT, payload: code })}
      highlight={code => (
        <Highlight
          {...props.getHighlighterProps({
            defaultProps,
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
