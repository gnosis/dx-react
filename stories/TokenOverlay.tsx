import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { array, object, boolean, text } from '@storybook/addon-knobs'
import { action, decorateAction } from '@storybook/addon-actions'

import TokenOverlay from 'components/TokenOverlay'
import { TokenBalances, TokenMod } from 'types'

import { codeList } from 'globals'

const tokenBalances = codeList.reduce(
  (acc, code) => (acc[code] = (Math.random() * 5).toFixed(9), acc), {},
) as TokenBalances

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
      width: 550,
      height: 500,
      position: 'relative',
    }}>
      {story()}
    </div>
  </div>
)

const getCodeFromArgs = decorateAction([
  args => [args[0].code],
])

storiesOf('TokenOverlay', module)
  .addDecorator(CenterDecor)
  .addWithJSX('open', () => <TokenOverlay
    closeOverlay={action('CLOSE OVERLAY')}
    selectTokenAndCloseOverlay={getCodeFromArgs('CLOSE OVERLAY AND SELECT')}
    tokenCodeList={array('tokenCodeList', codeList)}
    tokenBalances={object('tokenBalances', tokenBalances)}
    open={boolean('open', true)}
    mod={text('mod', 'sell') as TokenMod}
  />)
