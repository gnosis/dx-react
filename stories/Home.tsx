import React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { storeInit, bcMetamask } from './helpers'

const store = storeInit(bcMetamask)

import { Provider } from 'react-redux'

import Home from 'containers/Home'

const ProviderDecor: StoryDecorator = story => (
  <Provider store={store as any}>
    {story()}
  </Provider>
)

storiesOf('Home', module)
  .addDecorator(ProviderDecor)
  .add('Home', () => <Home />)
