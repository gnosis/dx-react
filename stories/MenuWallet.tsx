import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { text, number, object } from '@storybook/addon-knobs'
// import { decorateAction } from '@storybook/addon-actions'

import MenuWallet from 'components/MenuWallet'

const CenterDecor: StoryDecorator = story => (
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

const constructKnobs = (account: string, balance: number, tokens: object) => ({
  account: text('account', account),
  balance: number('balance', balance, {
    range: true,
    min: 0,
    max: 100,
    step: 0.00000001,
  }),
  tokens: object('tokens', tokens),
})

const tokenObj = {
  GNO: {
    name: 'GNO',
    balance: 12,
  },
  ETH: {
    name: 'ETH',
    balance: 10,
  }
}

storiesOf(`MenuWallet`, module)
  .addDecorator(CenterDecor)
  .addWithJSX('MenuWallet Component', () =>
    <MenuWallet
      {...constructKnobs('0x123jhbdsz7u2qwjhvda871273doaidsf', 22, tokenObj) }
    />
  )

