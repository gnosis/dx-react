import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import ButtonCTA from 'components/ButtonCTA'

const CenterDecor: StoryDecorator = story => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div className="auctionContainer" style={{
      width: 600,
      padding: 20,
      backgroundColor: 'white',
    }}>
      {story()}
    </div>
  </div>
)

const variants = {
  HOME: text('text', 'Continue to order details'),
  PANEL2: text('text', 'Continue to wallet details'),
  PANEL3: [text('text', 'Submit order'), <i className="icon icon-walletOK"></i>],
}

const story = storiesOf(`ButtonCTA`, module)
  .addDecorator(CenterDecor)

for (const vr of Object.keys(variants)) {
  story.addWithJSX(vr, () => (
    <ButtonCTA
      onClick={action('ButtonCTA clicked')}
    >
      {variants[vr]}
    </ButtonCTA>
  ))
}
