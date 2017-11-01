import React from 'react'

import NoWallet from 'containers/NoWallet'
import TextSquare from 'components/TextSquare'
import TokenPicker from 'containers/TokenPicker'

import { Providers } from 'types'

const Home = ({ activeProvider }: Providers[string]) => 
  <section className="home">
    <TextSquare />
    { (activeProvider === 'METAMASK' || activeProvider === 'MIST') ? <TokenPicker /> : <NoWallet /> }
  </section>

export default Home
