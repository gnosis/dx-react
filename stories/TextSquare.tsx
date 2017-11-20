import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-router'

import TextSquare from 'components/TextSquare'
import NoWallet from 'components/NoWallet'

import { CenterSectionDecorator } from './helpers'

storiesOf('TextSquare', module)
  .addDecorator(StoryRouter())
  .addDecorator(CenterSectionDecorator)
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
      <TextSquare key="0" />,
      <NoWallet
        key="1"
        handleClick={action('ButtonCTA clicked')}
        hide={boolean('Hide/Show', false)}
      />,
    ],
)
