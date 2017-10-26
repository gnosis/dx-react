import * as React from 'react'

import { storiesOf } from '@storybook/react'
// import { text, number, object } from '@storybook/addon-knobs'
// import { decorateAction } from '@storybook/addon-actions'

import Hamburger from 'components/Hamburger'

const TopRightDecor = (story: Function) => (
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

