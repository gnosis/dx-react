import React from 'react'

import NoWallet from 'containers/NoWallet'
import TextSquare from 'components/TextSquare'
import TokenPicker from 'containers/TokenPicker'

export interface HomeProps {
  walletEnabled: boolean,
  showPicker?: boolean,
  needsTokens?: boolean,
}

const Home: React.SFC<HomeProps> = ({ walletEnabled, showPicker }) =>
  <section className="home">
    <TextSquare />
    {(showPicker || walletEnabled) ?
      <TokenPicker to="/order" showPair={showPicker} /> : <NoWallet />
    }
  </section>

export default Home
