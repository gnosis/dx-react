import React from 'react'
import TokenItem from '../TokenItem'
import { code2tokenMap } from 'globals'
import { TokenPair, TokenBalances } from 'types'

export interface TokenPairProps {
  tokenBalances: TokenBalances,
  tokenPair: TokenPair,
  openOverlay(): any
}

const TokenPair: React.SFC<TokenPairProps> = ({
  tokenPair: { sell, buy },
  tokenBalances: { [sell]: sellTokenBalance, [buy]: buyTokenBalance },
  openOverlay,
}) => (
    <div className="tokenPair">
      <TokenItem code={sell} name={code2tokenMap[sell]} balance={sellTokenBalance} mod="SELL" onClick={openOverlay} />
      <TokenItem code={buy} name={code2tokenMap[buy]} balance={buyTokenBalance} mod="RECEIVE" onClick={openOverlay} />
    </div>
  )

export default TokenPair
