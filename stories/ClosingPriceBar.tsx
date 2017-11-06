import React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import { TokenCode } from 'types'

import ClosingPriceBar from 'components/ClosingPriceBar'

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
    <ClosingPriceBar
      buyToken={text('buyToken', 'GNO') as TokenCode} 
      header={variations[vrs].header}
      sellToken={text('sellToken', 'ETH') as TokenCode}
      sellTokenPrice={text('sellPrice', '0')}
    />,
  )
}
