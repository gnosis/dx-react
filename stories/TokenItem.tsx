import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { text, number } from '@storybook/addon-knobs'
import { decorateAction } from '@storybook/addon-actions'

import TokenItem from 'components/TokenItem'

const code2tokenMap = {
  ETH: 'ETHER',
  GNO: 'GNOSIS',
  REP: 'AUGUR',
  '1ST': 'FIRST BLOOD',
  OMG: 'OMISEGO',
  GNT: 'GOLEM',
}

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
      backgroundColor: 'white',
    }}>
      {story()}
    </div>
  </div>
)

const constructKnobs = (name: string, code: string, balance: number, mod?: string) => ({
  name: text('name', name),
  code: text('code', code),
  balance: number('balance', balance, {
    range: true,
    min: 0,
    max: 100,
    step: 0.00000001,
  }),
  mod: text('mod', mod),
})

const stringifyAction = decorateAction([
  args => [JSON.stringify(args[0])],
])


for (const code of Object.keys(code2tokenMap)) {
  const name = code2tokenMap[code]

  const r1 = +(Math.random() * 5).toFixed(9)
  const r2 = +(Math.random() * 5).toFixed(9)

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
