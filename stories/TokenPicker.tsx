import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-router'

import { DefaultTokenObject } from 'types'
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
    sell: { name: 'ETHER', symbol: 'ETH', address: '', decimals: 18 } as DefaultTokenObject,
    buy: { name: 'GNOSIS', symbol: 'GNO', address: '', decimals: 18 } as DefaultTokenObject,
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
  .addWithJSX('main', () => (
    <TokenPicker
      continueToOrder={action('Continue to order details')}
      setTokenListType={() => {}}
      needsTokens={boolean('needsTokens', false)}
      showPair={boolean('showPair', false)}
      tokensSelected={boolean('Tokens Selected', false)}
      to=""
      allowUpload={false}
    />
))
