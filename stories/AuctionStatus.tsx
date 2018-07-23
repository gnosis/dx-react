import React from 'react'

import { storiesOf } from '@storybook/react'
import { number, text, object } from '@storybook/addon-knobs'
import { makeCenterDecorator } from './helpers'

import AuctionStatus, { AuctionStatusProps } from 'components/AuctionStatus'
import { AuctionStatus as Status } from 'globals'

import { toBN as toBigNumber } from 'web3-utils'

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
  buyToken: object('buyToken', { name: 'GNOSIS', symbol: 'GNO', address: '', decimals: 18 }),
  sellToken: object('sellToken', { name: 'ETHER', symbol: 'ETH', address: '', decimals: 18 }),
  buyAmount: toBigNumber(number('buyAmount', 2.55203, {
    range: true,
    min: 0,
    max: 100,
    step: 0.00000001,
  })),
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
