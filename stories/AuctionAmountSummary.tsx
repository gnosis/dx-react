import React from 'react'

import { storiesOf } from '@storybook/react'
import { text, number } from '@storybook/addon-knobs'

import AuctionAmountSummary from 'components/AuctionAmountSummary'

import { makeCenterDecorator } from './helpers'

const CenterDecor = makeCenterDecorator({
  style: {
    height: null,
    padding: '60px 0',
  },
})

storiesOf('AuctionAmountSummary', module)
  .addDecorator(CenterDecor)
  .addWithJSX('PANEL 3', () => (
    <AuctionAmountSummary
      buyTokenSymbol={text('buyTokenSymbol', 'GNO')}
      sellTokenSymbol={text('sellTokenSymbol', 'ETH')}
      sellTokenAmount={number('sellAmount', 1.00000000).toString()}
      buyTokenAmount={number('buyAmount', 0.459459434).toString()}
    />
  ))
