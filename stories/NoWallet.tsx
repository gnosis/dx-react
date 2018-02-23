import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-router'

import { storeInit, bcMetamask, makeProviderDecorator, CenterSectionDecorator } from './helpers'

const store = storeInit(bcMetamask)

import TextSquare from 'components/TextSquare'
import NoWallet from 'components/NoWallet'

storiesOf('NoWallet', module)
  .addDecorator(StoryRouter())
  .addDecorator(makeProviderDecorator(store))
  .addDecorator(CenterSectionDecorator)
  .addWithJSX('NoWallet[Solo]', () =>
    <NoWallet
      handleClick={action('ButtonCTA clicked')}
      hide={boolean('Hide/Show', false)}
    />,
)
  .addWithJSX('Both', (): any =>
    [
      <TextSquare key="0" />,
      <NoWallet
        key="1"
        handleClick={action('ButtonCTA clicked')}
        hide={boolean('Hide/Show', false)}
      />,
    ],
)
