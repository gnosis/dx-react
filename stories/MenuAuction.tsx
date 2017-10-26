import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { object, text } from '@storybook/addon-knobs'

import MenuAuctions from 'components/MenuAuctions'

const tokenArr = [
  'GNO',
  'ETH',
  '1ST',
  'BIT',
  'EQO',
  '666',
  'COIN',
  'YO',
  'GHTO',
  'POLKA',
  'AUGR',
]

const getRandomInt = (min: number, max: number) => {
  const mn = Math.ceil(min)
  const mx = Math.floor(max)
  return Math.floor(Math.random() * (mx - mn)) + mn
}

// Create Fn that returns Array of length(x) w/Auction props (a,b,c,d,e)
const auctionFactory = (amt: number) => {
  const auctionsToShow = []
  
  for (let i = 0; i <= amt; i = i + 1) {
    auctionsToShow.push({
      id: +(Math.random() * 5).toFixed(3).toString(),
      sellToken: tokenArr[getRandomInt(0, tokenArr.length)],
      buyToken: tokenArr[getRandomInt(0, tokenArr.length)],
      buyPrice: +(Math.random() * 5).toFixed(4),
      claim: getRandomInt(0,4) < 2 ? false : true,
    })
  }
  return auctionsToShow
}

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
  ongoingAuctions: auctionsArr.map((item: Object, i: number) => object(`Ongoing Auctions ${i}`, item)),
})

storiesOf(`MenuAuctions`, module)
  .addDecorator(TopCenterDecor)
  .addWithJSX('MenuAuctionsComponent', () => 
    <MenuAuctions
      {...constructKnobs('YOUR AUCTIONS', auctionFactory(getRandomInt(1, 6))) }
    />,
  )

