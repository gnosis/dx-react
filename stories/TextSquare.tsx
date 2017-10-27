import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'

import TextSquare from 'components/TextSquare'
import NoWallet from 'components/NoWallet'

const CenterDecorSection = (story: Function) => (
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
)

storiesOf('TextSquare', module)
  .addDecorator(CenterDecorSection)
  .addWithJSX('TextSquareLeft[Intro]', () => 
    <TextSquare />,
  )
  .addWithJSX('TextSquareRight[No Wallet]', () => 
    <NoWallet 
      handleClick={action('ButtonCTA clicked')}
      hide={boolean('Hide/Show', false)}
    />,
  )
  .addWithJSX('TextSquareBoth', (): any => 
    [
      <TextSquare />,
      <NoWallet 
        handleClick={action('ButtonCTA clicked')}
        hide={boolean('Hide/Show', false)}
      />,
    ],
  )
