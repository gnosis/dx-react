import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { object, text } from '@storybook/addon-knobs'

import { auctionFactory, getRandomInt, tokenArr } from './helpers'

import MenuAuctions from 'components/MenuAuctions'

const TopCenterDecor: StoryDecorator = story => (
  <header>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {story()}
    </div>
  </header>
)

const constructKnobs = (
  name = 'YOUR AUCTIONS',
  auctionsArr: [any] | any,
) => ({
  name: text('title', name),
  ongoingAuctions: auctionsArr.map((item: object, i: number) => object(`Ongoing Auctions ${i}`, item)),
})

storiesOf(`MenuAuctions`, module)
  .addDecorator(TopCenterDecor)
  .addWithJSX('MenuAuctionsComponent', () =>
    <MenuAuctions
      {...constructKnobs('YOUR AUCTIONS', auctionFactory(getRandomInt(1, 6), tokenArr)) }
    />,
)

