import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { array, object, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import TokenOverlay from 'components/TokenOverlay'

import { code2tokenMap, TokenCode } from 'globals'

const codeList = Object.keys(code2tokenMap) as TokenCode[]

const tokenBalances = codeList.reduce(
  (acc, code) => (acc[code] = Math.random() * 5, acc), {},
) as {[code in TokenCode]: number }

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
      width: 550,
      height: 500,
      position: 'relative',
    }}>
      {story()}
    </div>
  </div>
)

storiesOf('TokenOverlay', module)
  .addDecorator(CenterDecor)
  .addWithJSX('open', () => <TokenOverlay
    closeOverlay={action('CLOSE OVERLAY')}
    tokenCodeList={array('tokenCodeList', codeList)}
    tokenBalances={object('tokenBalances', tokenBalances)}
    open={boolean('open', true)}
  />)
