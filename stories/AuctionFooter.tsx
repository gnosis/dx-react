import React from 'react'
import { toBigNumber } from 'web3/lib/utils/utils.js'
import { storiesOf } from '@storybook/react'
import { text, boolean, number } from '@storybook/addon-knobs'
import { makeCenterDecorator } from './helpers'

import AuctionFooter, { AuctionFooterProps } from 'components/AuctionFooter'

const CenterDecor = makeCenterDecorator({
  style: {
    backgroundColor: null,
    width: null,
    height: null,
    padding: 0,
    display: 'flex',
    alignItems: 'flex-end',
  },
  className: 'auctionContainer',
})

const constructKnobs = (auctionEnded: boolean) => {
  return ({
    buyTokenSymbol: text('buyTokenSymbol', 'GNO'),
    sellTokenSymbol: text('sellTokenSymbol', 'ETH'),
    sellAmount: toBigNumber(number('sellAmt', 100)),
    buyAmount: toBigNumber(number('buyAmt', 100)),
    sellDecimal: number('sellDecimal', 18),
    buyDecimal: number('buyDecimal', 18),
    auctionEnded: boolean('auctionEnded', auctionEnded),
  }) as AuctionFooterProps
}

storiesOf(`AuctionFooter`, module)
  .addDecorator(CenterDecor)
  .addWithJSX('connected', () => (
    <AuctionFooter {...constructKnobs(true) } />
  ))
  .addWithJSX('not connected', () => (
    <AuctionFooter {...constructKnobs(false) } />
  ))
