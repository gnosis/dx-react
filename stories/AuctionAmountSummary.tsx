import React from 'react'

import { storiesOf } from '@storybook/react'
import { object, number } from '@storybook/addon-knobs'
import { DefaultTokenObject } from 'types'

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
      buyToken={object('buyToken', { name: 'GNOSIS', symbol: 'GNO', address: '', decimals: 18 }) as DefaultTokenObject}
      sellToken={object('sellToken', { name: 'ETHER', symbol: 'ETH', address: '', decimals: 18 }) as DefaultTokenObject}
      sellTokenAmount={number('sellAmount', 1.00000000).toString()}
      buyTokenAmount={number('buyAmount', 0.459459434).toString()}
    />
  ))
