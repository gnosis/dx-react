import * as React from 'react'

import { storiesOf } from '@storybook/react'
// import { array, text } from '@storybook/addon-knobs'
// import { decorateAction } from '@storybook/addon-actions'

import Hamburger from 'components/Hamburger'

const CenterDecor = (story: Function) => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div style={{
      padding: 20,
      backgroundColor: 'transparent',
    }}>
      {story()}
    </div>
  </div>
)

// const constructKnobs = (
//   name = 'YOUR AUCTIONS',
//   auctionsArr: Array<any>,
//   separator: any
// ) => ({
//   name: text('title', name),
//   ongoingAuctions: array('Ongoing Auctions', auctionsArr, separator)
// })

storiesOf(`Hamburger`, module)
  .addDecorator(CenterDecor)
  .addWithJSX('Hamburger', () => 
    <Hamburger />
  )

