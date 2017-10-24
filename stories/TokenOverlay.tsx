import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { array } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import TokenOverlay from 'components/TokenOverlay'

// import { Story } from '@storybook/react'

// declare module '@storybook/react' {
//     export interface Story {
//         addWithJSX: Story['add']
//     }
// }



const code2tokenMap = {
  ETH: 'ETHER',
  GNO: 'GNOSIS',
  REP: 'AUGUR',
  '1ST': 'FIRST BLOOD',
  OMG: 'OMISEGO',
  GNT: 'GOLEM',
}

const codeList = Object.keys(code2tokenMap)

// TODO: get token balance from redux
const tokenBalances = {
  ETH: Math.random() * 5,
  GNO: Math.random() * 5,
  REP: Math.random() * 5,
  '1ST': Math.random() * 5,
  OMG: Math.random() * 5,
  GNT: Math.random() * 5,
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
    tokenBalances={tokenBalances}
  />)
