import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { text, number } from '@storybook/addon-knobs'
import { decorateAction } from '@storybook/addon-actions'

import TokenItem, { TokenItemProps } from 'components/TokenItem'
import { code2tokenMap, codeList } from 'globals'
import { TokenMod, Balance, TokenCode, TokenName } from 'types'


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
      backgroundColor: 'white',
    }}>
      {story()}
    </div>
  </div>
)

const constructKnobs = (name: TokenName, code: TokenCode, balance: Balance, mod?: TokenMod) => ({
  name: text('name', name),
  code: text('code', code),
  balance: number('balance', +balance, {
    range: true,
    min: 0,
    max: 100,
    step: 0.00000001,
  }).toString(),
  mod: text('mod', mod),
}) as TokenItemProps

const stringifyAction = decorateAction([
  args => [JSON.stringify(args[0])],
])


for (const code of codeList) {
  const name = code2tokenMap[code]

  const r1 = (Math.random() * 5).toFixed(9)
  const r2 = (Math.random() * 5).toFixed(9)

  storiesOf(`TokenItem/${name}`, module)
    .addDecorator(CenterDecor)
    .addWithJSX('in Pair', () => <TokenItem
      {...constructKnobs(name, code, r1, 'SELL') }
      onClick={stringifyAction('Token clicked')}
    />)
    .addWithJSX('in Picker', () => <TokenItem
      {...constructKnobs(name, code, r2) }
      onClick={stringifyAction('Token clicked')}
    />)
}
