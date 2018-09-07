import React from 'react'

import { storiesOf } from '@storybook/react'
import { object, text, boolean } from '@storybook/addon-knobs'

import { auctionFactory, getRandomInt, tokenArr, makeTopDecorator } from './helpers'

import MenuAuctions from 'components/MenuAuctions'

const TopCenterDecor = makeTopDecorator({
  style: {
    display: 'flex',
    justifyContent: 'center',
  },
})

const constructKnobs = (
  name = 'YOUR AUCTIONS',
  auctionsArr: [any] | any,
) => ({
  name: text('title', name),
  ongoingAuctions: auctionsArr.map((item: object, i: number) => object(`Ongoing Auctions ${i}`, item)),
  claimSellerFundsFromSeveral: () => console.log('Claiming!'),
  claimable: boolean('claimable', true),
  push: () => console.log('Moving to auction') as any,
})

storiesOf('MenuAuctions', module)
  .addDecorator(TopCenterDecor)
  .addWithJSX('MenuAuctionsComponent', () =>
    <MenuAuctions
      {...constructKnobs('YOUR AUCTIONS', auctionFactory(getRandomInt(1, 6), tokenArr)) }
    />,
)
