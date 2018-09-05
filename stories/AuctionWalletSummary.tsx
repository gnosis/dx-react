import React from 'react'

import { storiesOf } from '@storybook/react'
import { text, boolean } from '@storybook/addon-knobs'
import { makeCenterDecorator } from './helpers'

import AuctionWalletSummary from 'components/AuctionWalletSummary'

const CenterDecor = makeCenterDecorator({
  style: {
    backgroundColor: null,
    width: null,
    height: null,
    padding: '70px 0',
  },
  className: 'auctionContainer',
})

const constructKnobs = (connected: boolean) => ({
  address: text('address', '0x912454f8Ebc5hFba4C4f98d625D26329322d5444'),
  provider: text('provider', 'MetaMask'),
  network: text('network', 'ETHEREUM MAINNET'),
  connected: boolean('connected', connected),
})

storiesOf('AuctionWalletSummary', module)
  .addDecorator(CenterDecor)
  .addWithJSX('connected', () => (
    <AuctionWalletSummary {...constructKnobs(true) } />
  ))
  .addWithJSX('not connected', () => (
    <AuctionWalletSummary {...constructKnobs(false) } />
  ))
