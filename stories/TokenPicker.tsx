import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
// import { array, object, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import TokenPicker from 'components/TokenPicker'
import { TokenBalances, State, RatioPairs } from 'types'

import { codeList } from 'globals'
import { storeInit } from './helpers/mockStore'
import { Provider } from 'react-redux'

const tokenBalances = codeList.reduce(
  (acc, code) => (acc[code] = (Math.random() * 5).toFixed(9), acc), {},
) as TokenBalances

const ratioPairs = codeList.reduce((acc, code) => {
  if (code !== 'ETH') acc.push({
    sell: 'ETH',
    buy: code,
    price: Math.random().toFixed(8),
  })

  return acc
}, []) as RatioPairs

const initialState: Partial<State> = {
  tokenBalances,
  tokenPair: {
    sell: 'ETH',
    buy: 'GNO',
  },
  ratioPairs,
}

const store = storeInit(initialState)
console.log(store.getState())

const ProviderDecor: StoryDecorator = story => (
  <Provider store={store}>
    {story()}
  </Provider>
)


const CenterDecor: StoryDecorator = story => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div className="home" style={{
      padding: 20,
      backgroundColor: 'transparent',
      width: 550,
      height: 500,
      position: 'relative',
    }}>
      {story()}
    </div>
  </div>
)

storiesOf('TokenPicker', module)
  .addDecorator(ProviderDecor)
  .addDecorator(CenterDecor)
  .addWithJSX('main', () => <TokenPicker
    continueToOrder={action('Continue to order details')}
  />)
