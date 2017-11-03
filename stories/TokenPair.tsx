import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { object } from '@storybook/addon-knobs'
import { decorateAction } from '@storybook/addon-actions'

import TokenPair from 'components/TokenPair'

import { generateTokenBalances, generateTokenPair, makeCenterDecorator } from './helpers'

const codePair = generateTokenPair()

const tokenBalances = generateTokenBalances()

const CenterDecor = makeCenterDecorator({
  style: {
    width: 500,
    height: null,
  },
})

const getModFromArgs = decorateAction([
  args => [args[0].mod],
])

storiesOf('TokenPair', module)
  .addDecorator(CenterDecor)
  .addWithJSX('SELL <-> RECEIVE', () => <TokenPair
    openOverlay={getModFromArgs('OPEN OVERLAY to select a token to')}
    tokenPair={object('tokenPair', codePair)}
    tokenBalances={object('tokenBalances', tokenBalances)}
  />)
