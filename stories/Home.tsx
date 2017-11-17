import React from 'react'

import { storiesOf } from '@storybook/react'
import StoryRouter from 'storybook-router'
import { storeInit, bcMetamask, makeProviderDecorator } from './helpers'

const store = storeInit(bcMetamask)

const ProviderDecor = makeProviderDecorator(store)

import Home from 'containers/Home'

storiesOf('Home', module)
  .addDecorator(StoryRouter())
  .addDecorator(ProviderDecor)
  .add('Home', () => <Home />)
