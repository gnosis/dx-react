import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-router'

import TokenPicker from 'components/TokenPicker'

import {
  storeInit,
  generateTokenBalances,
  generateRatioPairs,
  makeProviderDecorator,
  makeCenterDecorator,
} from './helpers'

const tokenBalances = generateTokenBalances()

const ratioPairs = generateRatioPairs()

const store = storeInit({
  tokenBalances,
  tokenPair: {
    sell: 'ETH',
    buy: 'GNO',
    sellAmount: '0',
  },
  ratioPairs,
})

const CenterDecor = makeCenterDecorator({
  style: {
    backgroundColor: null,
  },
  className: 'home',
})

storiesOf('TokenPicker', module)
  .addDecorator(StoryRouter())
  .addDecorator(makeProviderDecorator(store))
  .addDecorator(CenterDecor)
  .addWithJSX('main', () => <TokenPicker
    continueToOrder={action('Continue to order details')}
    to=""
  />)
