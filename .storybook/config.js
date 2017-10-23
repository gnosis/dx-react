import { addDecorator, configure, setAddon } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import JSXAddon from 'storybook-addon-jsx'

import '../src/styles/global.scss'

window.regeneratorRuntime = require('babel-runtime/regenerator')

const req = require.context('../src/components', true, /\.stories\.tsx$/)


addDecorator(withKnobs)
setAddon(JSXAddon)

function loadStories() {
  require('../stories/index.tsx')
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
