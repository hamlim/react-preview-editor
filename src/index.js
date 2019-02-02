import React, { useEffect, useContext, useState, useRef, useReducer, useMemo } from 'react'
import ReactDOM from 'react-dom'
import Highlight, { defaultProps } from 'prism-react-renderer'
import CodeEditor from 'react-simple-code-editor'

import babel from '@babel/standalone'

const { transform } = babel

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

const context = React.createContext({
  code: '',
  scope: defaultScope,
  transformCode(code) {
    return defualtTransformer(code)
  },
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

function defualtTransformer(code) {
  return transform(code, {
    presets: [['stage-0', { decoratorsLegacy: true }], 'react'],
  }).code
}

export function Preview() {
  const { code, scope, transformCode, dispatch } = useContext(context)
  useEffect(() => {
    let transformed = transformCode(code)
    const func = new Function(...Object.keys(scope), transformed)
    try {
      func(Object.values(scope))
    } catch (error) {
      dispatch({ type: TYPES.ERROR, payload: error })
    }
  }, [code, scope, dispatch, transformCode])
  return <div data-react-preview-editor="preview" />
}

export function Provider({ code, transformCode, scope, children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const ctx = useMemo(
    () => ({
      code,
      scope: { ...defaultScope, ...scope },
      dispatch,
      transformCode(code) {
        return transformCode(code, { defualtTransformer })
      },
    }),
    [state, scope, dispatch, code],
  )
  return <context.Provider value={ctx}>{children}</context.Provider>
}

Provider.defaultProps = {
  transformCode(code, { defualtTransformer }) {
    return defualtTransformer(code)
  },
  scope: defaultScope,
}

function createHighlighter(props) {
  return function highlight(code) {
    return (
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
    )
  }
}

export function Editor(props) {
  const { code, dispatch } = useContext(context)

  const highlighter = createHighlighter(props)

  return (
    <Editor
      value={code}
      onValueChange={code => dispatch({ type: TYPES.EDIT, payload: code })}
      highlight={highlighter}
      {...props}
    />
  )
}

Editor.defaultProps = {
  getHighlighterProps(props) {
    return props
  },
}
