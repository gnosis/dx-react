import * as React from 'react'

import { storiesOf } from '@storybook/react'
import StoryRouter from 'storybook-router'
import { storeInit, bcMetamask, makeProviderDecorator } from './helpers'

const store = storeInit(bcMetamask)

const ProviderDecor = makeProviderDecorator(store)

import Header from 'components/Header'

storiesOf('Header [v2]', module)
  .addDecorator(StoryRouter())
  .addDecorator(ProviderDecor)
  .add('Header', () => <Header />)
