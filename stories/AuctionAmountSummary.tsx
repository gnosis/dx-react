import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { text, number } from '@storybook/addon-knobs'
import { TokenCode } from 'types'

import AuctionAmountSummary from 'components/AuctionAmountSummary'

import { makeCenterDecorator } from './helpers'


const CenterDecor = makeCenterDecorator({
  style: {
    height: null,
  },
})

storiesOf('AuctionAmountSummary', module)
  .addDecorator(CenterDecor)
  .addWithJSX('PANEL 3', () => (
    <AuctionAmountSummary
      buyToken={text('buyToken', 'GNO') as TokenCode}
      sellToken={text('sellToken', 'ETH') as TokenCode}
      sellTokenAmount={number('sellAmount', 1.00000000).toString()}
      buyTokenAmount={number('buyAmount', 0.459459434).toString()}
    />
  ))
