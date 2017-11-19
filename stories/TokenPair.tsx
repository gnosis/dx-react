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
    width: 650,
    height: null,
    backgroundColor: null,
  },
})

const getModFromArgs = decorateAction([
  args => [args[0].mod],
])

const tokenPair = () => <TokenPair
  openOverlay={getModFromArgs('OPEN OVERLAY to select a token to')}
  tokenPair={object('tokenPair', codePair)}
  tokenBalances={object('tokenBalances', tokenBalances)}
/>

storiesOf('TokenPair', module)
  .addDecorator(CenterDecor)
  .addWithJSX('HOME', () => (
    <div className="tokenIntro" style={{ width: 540, backgroundColor: 'white', margin: 'auto' }}>
      {tokenPair()}
    </div>
  ))
  .addWithJSX('PANEL 2', () => (
    <div className="auctionContainer">
      {tokenPair()}
    </div>
  ))
