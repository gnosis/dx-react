import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'

import { storeInit, bcMetamask } from './helpers/mockStore'

const store = storeInit(bcMetamask)

import { Provider } from 'react-redux'
import TextSquare from 'components/TextSquare'
import NoWallet from 'components/NoWallet'

const Provider__CenterDecorSection: StoryDecorator = story =>
  <Provider store={store}>
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <section className="home">
        {story()}
      </section>
    </div>
  </Provider>

storiesOf('NoWallet', module)
  .addDecorator(Provider__CenterDecorSection)
  .addWithJSX('NoWallet[Solo]', () =>
    <NoWallet
      handleClick={action('ButtonCTA clicked')}
      hide={boolean('Hide/Show', false)}
    />,
)
  .addWithJSX('Both', (): any =>
    [
      <TextSquare />,
      <NoWallet
        handleClick={action('ButtonCTA clicked')}
        hide={boolean('Hide/Show', false)}
      />,
    ],
)
