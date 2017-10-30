import * as React from 'react'

import { storiesOf, StoryDecorator } from '@storybook/react'

import Hamburger from 'components/Hamburger'

const TopRightDecor: StoryDecorator = story => (
  <header>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {story()}
    </div>
  </header>
)

storiesOf(`Hamburger`, module)
  .addDecorator(TopRightDecor)
  .addWithJSX('Hamburger Component', () =>
    <Hamburger />,
)

