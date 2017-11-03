import React from 'react'

import { storiesOf } from '@storybook/react'
import { number, text } from '@storybook/addon-knobs'
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
      balance={text('balance', '20')} 
      buyToken={text('buyToken', 'GNO') as TokenCode}
      ratio={number('sellRatio', 1.0)}
      sellToken={text('sellToken', 'ETH') as TokenCode}
    />)
