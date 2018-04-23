import React from 'react'

import { storiesOf } from '@storybook/react'
import { number, text, object } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { makeCenterDecorator/*, storeInit, bcMetamask, makeProviderDecorator */ } from './helpers'

import { DefaultTokenObject } from 'types'

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
  .add('AuctionSellingGetting', () => {
    const sellAmount = number('sellAmount', 0).toString()
    const ratio = number('sellRatio', 1.5)
    const buyAmount = (+sellAmount * ratio).toString()

    return (
      <AuctionSellingGetting
        sellTokenBalance={text('balance', '20')}
        buyTokenSymbol={object('buyTokenSymbol', 'GNO')}
        sellTokenSymbol={object('sellTokenSymbol', 'ETH')}
        sellAmount={sellAmount}
        buyAmount={buyAmount}
        setSellTokenAmount={action('Set sellTokenAmount')}
      />
    )
  })
