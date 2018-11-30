import React from 'react'

import NoWallet from 'containers/NoWallet'
import TextSquare from 'components/TextSquare'
import TokenPicker from 'containers/TokenPicker'
import { ClaimOnly } from 'components/NoWallet'

export interface HomeProps {
  walletEnabled: boolean,
  showPicker?: boolean,
  needsTokens?: boolean,
  claimOnly?: boolean,
}

const Home: React.SFC<HomeProps> = ({ claimOnly, walletEnabled, showPicker }) =>
  <section className="home">
    <TextSquare claimOnly />
    {
      !walletEnabled ? <NoWallet />
        :
      claimOnly ? <ClaimOnly />
        :
      <TokenPicker to="/order" showPair={showPicker} />
    }
  </section>

export default Home
