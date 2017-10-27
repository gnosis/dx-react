import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'

import TextSquare from 'components/TextSquare'
import NoWallet from 'components/NoWallet'

const CenterDecor = (story: Function) => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {story()}
  </div>
)

storiesOf('TextSquare', module)
  .addDecorator(CenterDecor)
  .addWithJSX('TextSquareLeft[Intro]', () => 
    <section className="home">
      <TextSquare />
    </section>,
  )
  .addWithJSX('TextSquareRight[No Wallet]', () => 
    <section className="home">
      <NoWallet 
        handleClick={action('ButtonCTA clicked')}
        hide={boolean('Hide/Show', false)}
      />
    </section>,
  )
  .addWithJSX('TextSquareBoth', () => 
    <section className="home">
      <TextSquare />
      <NoWallet 
        handleClick={action('ButtonCTA clicked')}
        hide={boolean('Hide/Show', false)}
      />
    </section>,
  )
