import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { object } from '@storybook/addon-knobs'
import { decorateAction } from '@storybook/addon-actions'

import TopAuctions from 'components/TopAuctions'

import { generateRatioPairs, makeCenterDecorator } from './helpers'
import { getTop5Pairs } from 'selectors/ratioPairs'

const ratioPairs = generateRatioPairs()

const CenterDecor = makeCenterDecorator({
  style: {
    width: 500,
    height: 70,
  },
})

const stringifyAction = decorateAction([
  args => [JSON.stringify(args[0])],
])

storiesOf(`TopAuctions`, module)
  .addDecorator(CenterDecor)
  .addWithJSX('5 random pairs', () => {
    const top5Pairs = getTop5Pairs(ratioPairs.map((pair, i) => object(`Pair ${i}`, pair)))
    return <TopAuctions pairs={top5Pairs} selectTokenPair={stringifyAction('SELECT_TOKEN_PAIR')} />
  })
