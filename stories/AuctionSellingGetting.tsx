import React from 'react'

import { storiesOf } from '@storybook/react'
import { number, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { makeCenterDecorator/*, storeInit, bcMetamask, makeProviderDecorator */ } from './helpers'

import { toBigNumber } from 'web3/lib/utils/utils.js'

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
        maxSellAmount={toBigNumber(number('balance', 20))}
        buyTokenSymbol={text('buyTokenSymbol', 'GNO')}
        sellTokenSymbol={text('sellTokenSymbol', 'ETH')}
        sellTokenAddress={text('sellTokenAddress', '0x0')}
        sellAmount={sellAmount}
        buyAmount={buyAmount}
        setSellTokenAmount={action('Set sellTokenAmount')}
      />
    )
  })
