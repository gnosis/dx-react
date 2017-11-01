import React from 'react'

import NoWallet from 'containers/NoWallet'
import TextSquare from 'components/TextSquare'
import TokenPicker from 'containers/TokenPicker'

import { Providers } from 'types'

const Home = ({ selectedProvider }: Providers[string]) => 
  <section className="home">
    <TextSquare />
    { selectedProvider.available ? <TokenPicker /> : <NoWallet /> }
  </section>

export default Home
