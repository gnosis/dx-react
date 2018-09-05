import React from 'react'

import { storiesOf } from '@storybook/react'
import { makeTopDecorator } from './helpers'

const TopRightDecorator = makeTopDecorator({
  style: {
    justifyContent: 'flex-end',
  },
})

import Hamburger from 'components/Hamburger'

storiesOf('Hamburger', module)
  .addDecorator(TopRightDecorator)
  .addWithJSX('Hamburger Component', () =>
    <Hamburger />,
)
