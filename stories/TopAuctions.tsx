import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { object } from '@storybook/addon-knobs'

import TopAuctions from 'components/TopAuctions'

import { code2tokenMap } from 'globals'

/*
* ratioPairs = {
*  'GNO/ETH': 0.31214312,
   'OMG/ETH': 0.01976562,
*  ...
* }
*/
const ratioPairs = Object.keys(code2tokenMap).reduce((acc, code) => {
  if (code === 'ETH') return acc

  acc[`${code}/ETH`] = +Math.random().toFixed(8)
  return acc
}, {}) as { [pair: string]: number }


/**
 * sorts pairs by ASC and takes top 5
 * @param {typeof ratioPairs} pairs 
 * @returns {typeof ratioPairs}
 */
const getTop5Pairs = (pairs: typeof ratioPairs) => Object.keys(pairs).sort((a, b) => pairs[b] - pairs[a])
  .slice(0, 5).reduce((acc, pair) => (acc[pair] = pairs[pair], acc), {})

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
      position: 'relative',
      width: 500,
      height: 70,
      padding: 20,
      backgroundColor: 'white',
    }}>
      {story()}
    </div>
  </div>
)

storiesOf(`TopAuctions`, module)
  .addDecorator(CenterDecor)
  .addWithJSX('5 random pairs', () => {
    const top5Pairs = getTop5Pairs(object('ratioPairs', ratioPairs))
    return <TopAuctions pairs={top5Pairs} />
  })
