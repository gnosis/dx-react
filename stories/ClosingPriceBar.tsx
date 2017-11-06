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
  .addDecorator(ProviderDecorator)
  // .add('ClosingPriceBar', () => <ClosingPriceBar />)

for (const vrs of Object.keys(variations)) {
  story.addWithJSX(vrs, (): React.ReactElement<string> => 
    <ClosingPriceBar header={variations[vrs].header}/>,
  )
}
