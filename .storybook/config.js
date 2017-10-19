const { configure } = require('@storybook/react')

window.regeneratorRuntime = require('babel-runtime/regenerator');

function loadStories() {
  require('../stories/index.tsx');
}

configure(loadStories, module);
