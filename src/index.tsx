import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import App, { initializer } from 'components/App'

/* global document */
const rootElement = document.getElementById('root')

ReactDOM.render(<App />, rootElement, initializer)
