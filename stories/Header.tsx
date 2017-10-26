import * as React from 'react'

const { storiesOf } = require('@storybook/react')

import createStoreWithHistory from 'store.js'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
const store = createStoreWithHistory(history)
import { Provider } from 'react-redux'

import Header from 'components/Header'

storiesOf('Header [v2]', module)
  .addDecorator((story: any) => <Provider store={store as any}>{story()}</Provider>)
  .add('Header', () => <Header />)
  