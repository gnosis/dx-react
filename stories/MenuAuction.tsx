import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { object, text } from '@storybook/addon-knobs'

import { tokenArr } from './helpers/data'
import { auctionFactory, getRandomInt } from './helpers/fn'

import MenuAuctions from 'components/MenuAuctions'

const TopCenterDecor = (story: Function) => (
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

