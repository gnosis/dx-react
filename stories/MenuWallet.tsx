import React from 'react'

import { storiesOf } from '@storybook/react'
import { text, number } from '@storybook/addon-knobs'
import { tokenArr, getRandomInt, walletObjectFactory, makeCenterDecorator } from './helpers'

import MenuWallet from 'components/MenuWallet'

const CenterDecor = makeCenterDecorator({
  style: {
    backgroundColor: null,
    width: null,
    height: null,
  },
})

const constructKnobs = (account: string, balance: number, tokens: object | any) => ({
  account: text('account', account),
  balance: number('balance', balance, {
    range: true,
    min: 0,
    max: 100,
    step: 0.00000001,
  }),
  tokens,
})

storiesOf(`MenuWallet`, module)
  .addDecorator(CenterDecor)
  .addWithJSX('MenuWallet Component', () =>
    <MenuWallet
      {...constructKnobs('0x123jhbdsz7u2qwjhvda871273doaidsf', 22, walletObjectFactory(getRandomInt(5, 20), tokenArr)) as any }
    />,
)
