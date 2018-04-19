import React from 'react'

import { storiesOf } from '@storybook/react'
import { object, boolean, number } from '@storybook/addon-knobs'
import { makeCenterDecorator } from './helpers'
import { DefaultTokenObject } from 'types'

import AuctionFooter, { AuctionFooterProps } from 'components/AuctionFooter'

const CenterDecor = makeCenterDecorator({
  style: {
    backgroundColor: null,
    width: null,
    height: null,
    padding: 0,
    display: 'flex',
    alignItems: 'flex-end',
  },
  className: 'auctionContainer',
})

const constructKnobs = (auctionEnded: boolean) => {
  const range = (name: string, amount: number) => +number(name, amount, {
    range: true,
    min: 0.0000001,
    max: 100,
    step: 0.00000001,
  }).toFixed(7)

  return ({
    buyToken: object('buyToken', { name: 'GNOSIS', symbol: 'GNO', address: '', decimals: 18 }) as DefaultTokenObject,
    sellToken: object('sellToken', { name: 'ETHER', symbol: 'ETH', address: '', decimals: 18 }) as DefaultTokenObject,
    sellAmount: range('sellAmount', 1),
    buyAmount: range('buyAmount', 2.5520300),
    auctionEnded: boolean('auctionEnded', auctionEnded),
  }) as AuctionFooterProps
}

storiesOf(`AuctionFooter`, module)
  .addDecorator(CenterDecor)
  .addWithJSX('connected', () => (
    <AuctionFooter {...constructKnobs(true) } />
  ))
  .addWithJSX('not connected', () => (
    <AuctionFooter {...constructKnobs(false) } />
  ))
