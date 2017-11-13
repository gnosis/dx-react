interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any,
  web3: any,
}

declare module 'storybook-router'
declare module 'web3'
declare module 'truffle-contract'

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.json' {
  const content: any
  export default content
}

declare const before: typeof beforeAll
