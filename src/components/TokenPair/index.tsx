import React from 'react'
import TokenItem from '../TokenItem'
import { code2tokenMap } from 'globals'
import { TokenCode, Balance } from 'types'

export interface TokenPairProps {
  sellToken: TokenCode,
  buyToken: TokenCode,
  sellTokenBalance: Balance,
  buyTokenBalance: Balance,
  openOverlay(): any
  swapTokensInAPair(): any
}

const TokenPair: React.SFC<TokenPairProps> = ({
  sellToken,
  buyToken,
  sellTokenBalance,
  buyTokenBalance,
  openOverlay,
  swapTokensInAPair,
}) => (
    <div className="tokenPair">
      <TokenItem
        code={sellToken}
        name={code2tokenMap[sellToken]}
        balance={sellTokenBalance}
        mod="sell"
        onClick={openOverlay}
      />
      <TokenItem
        code={buyToken}
        name={code2tokenMap[buyToken]}
        balance={buyTokenBalance}
        mod="buy"
        onClick={openOverlay}
      />
      <div className="tokenPair-switch" onClick={swapTokensInAPair}></div>
    </div>
  )

export default TokenPair
