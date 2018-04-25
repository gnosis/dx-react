import React from 'react'

import NoWallet from 'containers/NoWallet'
import TextSquare from 'components/TextSquare'
import TokenPicker from 'containers/TokenPicker'

import { Providers } from 'types'

export interface HomeProps {
  activeProvider: Providers['METAMASK' | 'MIST'],
  showPicker?: boolean,
  needsTokens?: boolean,
}

const Home: React.SFC<HomeProps> = ({ activeProvider, showPicker }) =>
  <section className="home">
    <TextSquare />
    {(showPicker || activeProvider === 'METAMASK' || activeProvider === 'MIST') ?
    <TokenPicker to="/order" showPair={showPicker} /> : <NoWallet />}
  </section>

export default Home
