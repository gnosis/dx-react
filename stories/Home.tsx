import React from 'react'

import { storiesOf } from '@storybook/react'
import { storeInit, bcMetamask, makeProviderDecorator } from './helpers'

const store = storeInit(bcMetamask)

const ProviderDecor = makeProviderDecorator(store)

import Home from 'containers/Home'

storiesOf('Home', module)
  .addDecorator(ProviderDecor)
  .add('Home', () => <Home />)
