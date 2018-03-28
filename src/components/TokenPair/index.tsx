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
}

const TokenPair: React.SFC<TokenPairProps> = ({
  sellToken,
  buyToken,
  sellTokenBalance,
  buyTokenBalance,
  openOverlay,
}) => (
    <div className="tokenPair noTokenList">{/* If no tokenlist with actual tokens has been uploaded yet, we add the class 'noTokenList' here. Regard this as the init. state */}
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

      {/* If no tokenlist uploaded display this message */}
      <span>Upload a token list before picking a token pair. Read more in our <a href="#" target="_blank">FAQ</a> on how it works.</span>
    </div>
  )

export default TokenPair
