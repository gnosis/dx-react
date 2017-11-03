interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any,
  web3: any,
}

declare module 'storybook-router'

declare module '*.svg' {
  const content: any
  export default content
}
