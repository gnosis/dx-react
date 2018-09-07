import React from 'react'

import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-router'

import { makeCenterDecorator } from './helpers'
import ButtonCTA from 'components/ButtonCTA'

const CenterDecor = makeCenterDecorator({
  style: {
    padding: 50,
    height: null,
  },
})

const variants = {
  HOME: text('text', 'Continue to order details'),
  PANEL2: text('text', 'Continue to wallet details'),
  PANEL3: [text('text', 'Submit order'), <i className="icon icon-walletOK" key="icon"></i>],
}

const story = storiesOf('ButtonCTA', module)
  .addDecorator(StoryRouter())
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
