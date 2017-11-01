import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { object } from '@storybook/addon-knobs'

import TopAuctions from 'components/TopAuctions'

import { codeList } from 'globals'
import { RatioPairs } from 'types'

/*
* ratioPairs = {
*  { buy: 'GNO' sell: 'ETH', price: 0.31214312 },
   { buy: 'OMG', sell: 'ETH', price: 0.01976562 },
*  ...
* }
*/
const ratioPairs = codeList.reduce((acc, code) => {
  if (code !== 'ETH') acc.push({
    sell: 'ETH',
    buy: code,
    price: Math.random().toFixed(8),
  })

  return acc
}, []) as RatioPairs

/**
 * sorts pairs by ASC and takes top 5
 * @param {typeof ratioPairs} pairs 
 * @returns {typeof ratioPairs}
 */
const getTop5Pairs = (pairs: RatioPairs) => pairs.slice()
  .sort((a, b) => +b.price - +a.price)
  .slice(0, 5)

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
    const top5Pairs = getTop5Pairs(ratioPairs.map((pair, i) => object(`Pair ${i}`, pair)))
    return <TopAuctions pairs={top5Pairs} />
  })
