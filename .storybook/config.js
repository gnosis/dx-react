import { addDecorator, configure, setAddon } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import JSXAddon from 'storybook-addon-jsx'

import '../src/styles/global.scss'

window.regeneratorRuntime = require('babel-runtime/regenerator')
require('./extraTypings.ts')

const req = require.context('../stories', false, /\.tsx$/)

addDecorator(withKnobs)
setAddon(JSXAddon)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
