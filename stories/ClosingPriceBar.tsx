import React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'

import { makeProviderDecorator, storeInit, tokenPairState } from './helpers' 

import ClosingPriceBar from 'containers/ClosingPriceBar'

const ProviderDecorator = makeProviderDecorator(storeInit(tokenPairState))

const AuctionSectionDecorator: StoryDecorator = story => (
  <section className="auction">
    <div className="auctionContainer" style={{ display: 'flex', alignItems: 'center' }}>
      {story()}
    </div>
  </section>
)

storiesOf('ClosingPriceBar', module)
  .addDecorator(AuctionSectionDecorator)
  .addDecorator(ProviderDecorator)
  .add('ClosingPriceBar', () => <ClosingPriceBar />)
