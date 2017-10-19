import * as React from 'react';

const { storiesOf } = require('@storybook/react')
const { action } = require('@storybook/addon-actions')
const { linkTo } = require('@storybook/addon-links/')
const { Button, Welcome } = require('@storybook/react/demo')

import BalanceButton from '../src/containers/BalanceButton/'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('App/Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>)
  .add('some random button', () => <Button>Hello World</Button>)
  .add('BalanceButton Container', () => <BalanceButton>This is a Balance Button</BalanceButton>)
