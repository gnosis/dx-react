import React from 'react'

import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-router'
import { makeCenterDecorator } from './helpers'

import AuctionHeader from 'components/AuctionHeader'

const CenterDecor = makeCenterDecorator({
  style: {
    backgroundColor: null,
    width: null,
    height: null,
  },
})

const variants = {
  PANEL2: {
    header: { children: text('text', 'Token Auction ETH/GNO'), backTo: '/' },
    dataScreen: 'amount',
  },
  PANEL3: {
    header: { children: text('text', 'Confirm Order Details'), backTo: '/amount' },
    dataScreen: 'details',
  },
  PANEL4: {
    header: { children: [text('text', 'Auction URL: '), <a href="#">https://www.dutchx.pm/auction/0x03494929349594/</a>] },
    dataScreen: 'status',
  },
}

const story = storiesOf(`AuctionHeader`, module)
  .addDecorator(CenterDecor)
  .addDecorator(StoryRouter())

for (const vr of Object.keys(variants)) {
  story.addWithJSX(vr, () => (
    <div className="auctionContainer" data-screen={variants[vr].dataScreen}>
      <AuctionHeader {...variants[vr].header} />
    </div>
  ))
}
