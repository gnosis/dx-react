import React from 'react'

import { storiesOf } from '@storybook/react'
import { number, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { makeCenterDecorator/*, storeInit, bcMetamask, makeProviderDecorator */ } from './helpers'

import { TokenCode } from 'types'

const CenterDecorator = makeCenterDecorator({
  style: {
    display: 'flex',
    alignItems: 'center',
  },
})

// const store = storeInit(bcMetamask)
// const ProviderDecor = makeProviderDecorator(store)

import AuctionSellingGetting from 'components/AuctionSellingGetting'

storiesOf('Auction Sell & Get', module)
  .addDecorator(CenterDecorator)
  // .addDecorator(ProviderDecor)
  .add('AuctionSellingGetting', () =>
    <AuctionSellingGetting
      sellTokenBalance={text('balance', '20')}
      buyToken={text('buyToken', 'GNO') as TokenCode}
      sellToken={text('sellToken', 'ETH') as TokenCode}
      sellAmount={number('sellAmount', 0).toString()}
      buyAmount={number('sellAmount', 0).toString()}
      setSellTokenAmount={action('Set sellTokenAmount')}
    />)
