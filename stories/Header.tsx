import * as React from 'react'

const { storiesOf } = require('@storybook/react')

import createStoreWithHistory from '../src/store.js'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
const store = createStoreWithHistory(history)
import { Provider } from 'react-redux'

import Header from '../src/components/Header'

storiesOf('Header', module)
  .addDecorator((story: any) => <Provider store={store as any}>{story()}</Provider>)
  .add('Dumb Header', () => <Header />)
  