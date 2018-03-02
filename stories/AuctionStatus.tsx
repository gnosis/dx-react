import React from 'react'

import { storiesOf } from '@storybook/react'
import { number, text } from '@storybook/addon-knobs'
import { makeCenterDecorator } from './helpers'

import AuctionStatus, { AuctionStatusProps } from 'components/AuctionStatus'
import { AuctionStatus as Status } from 'globals'

const CenterDecor = makeCenterDecorator({
  style: {
    backgroundColor: null,
    width: null,
    height: null,
    // padding: '130px 0 75px',
  },
  className: 'auctionContainer',
})

const constructKnobs = (status: string) => ({
  sellToken: text('sellToken', 'ETH'),
  buyToken: text('sellToken', 'GNO'),
  buyAmount: number('buyAmount', 2.55203, {
    range: true,
    min: 0,
    max: 100,
    step: 0.00000001,
  }),
  timeLeft: 73414,
  status: text('status', status),
}) as AuctionStatusProps

const story = storiesOf(`AuctionStatus`, module)
  .addDecorator(CenterDecor)

for (const key of Object.keys(Status)) {
  const status = Status[key]
  story.addWithJSX(`${status} auction`, () => (
    <AuctionStatus {...constructKnobs(status) } />
  ))
}
