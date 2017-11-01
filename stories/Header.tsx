import * as React from 'react'

const { storiesOf } = require('@storybook/react')
import { storeInit, bcMetamask } from './helpers'

const store = storeInit(bcMetamask)

import { Provider } from 'react-redux'

import Header from 'containers/Header'

storiesOf('Header [v2]', module)
  .addDecorator((story: any) => <Provider store={store as any}>{story()}</Provider>)
  .add('Header', () => <Header />)
