import React from 'react'
import TokenItem from '../TokenItem'
import { code2tokenMap, TokenCode } from 'globals'

interface TokenPairProps {
  tokenBalances: {[code in TokenCode]: number },
  tokenPair: { sell: TokenCode, buy: TokenCode },
  openOverlay(): void
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
