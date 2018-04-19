import React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { object, text } from '@storybook/addon-knobs'

import { DefaultTokenObject } from 'types'

import AuctionPriceBar from 'components/AuctionPriceBar'

const AuctionSectionDecorator: StoryDecorator = story => (
  <section className="auction">
    <div className="auctionContainer" style={{ display: 'flex', alignItems: 'center' }}>
      {story()}
    </div>
  </section>
)

const variations = {
  PANEL2: {
    header: 'Closing Price',
  },
  PANEL3: {
    header: 'Price',
  },
}

const story = storiesOf('ClosingPriceBar', module)
  .addDecorator(AuctionSectionDecorator)

for (const vrs of Object.keys(variations)) {
  story.addWithJSX(vrs, () => 
    <AuctionPriceBar
      buyToken={object('buyToken', { name: 'GNOSIS', symbol: 'GNO', address: '', decimals: 18 }) as DefaultTokenObject}
      sellToken={object('sellToken', { name: 'ETHER', symbol: 'ETH', address: '', decimals: 18 }) as DefaultTokenObject}
      header={variations[vrs].header}
      sellTokenPrice={text('sellPrice', '0')}
    />,
  )
}
