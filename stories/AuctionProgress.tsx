import React from 'react'

import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import { makeCenterDecorator } from './helpers'

import AuctionProgress from 'components/AuctionProgress'

const CenterDecor = makeCenterDecorator({
  style: {
    backgroundColor: null,
    width: null,
    height: null,
    padding: '130px 0 75px',
  },
  className: 'auctionContainer',
})

const range = () => number('progress', 2, {
  range: true,
  min: 0,
  max: 4,
  step: 1,
})

storiesOf(`AuctionProgress`, module)
  .addDecorator(CenterDecor)
  .addWithJSX('ongoing auction', () => (
    <AuctionProgress progress={range()} />
  ))
