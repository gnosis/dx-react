import React from 'react'

import NoWallet from 'containers/NoWallet'
import TextSquare from 'components/TextSquare'
import TokenPicker from 'containers/TokenPicker'

import { Providers } from 'types'

export interface HomeProps {
  activeProvider: Providers['METAMASK' | 'MIST']
}

const Home: React.SFC<HomeProps> = ({ activeProvider }) => 
  <section className="home">
    <TextSquare />
    { (activeProvider === 'METAMASK' || activeProvider === 'MIST') ? <TokenPicker /> : <NoWallet /> }
  </section>

export default Home
