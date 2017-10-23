const req = require.context('../src/components', true, /\.stories\.tsx$/)

window.regeneratorRuntime = require('babel-runtime/regenerator');

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
