import React from 'react'
import TokenItem, { NoTokenItem } from '../TokenItem'
import { code2tokenMap } from 'globals'
import { BigNumber, DefaultTokenObject } from 'types'

export interface TokenPairProps {
  sellToken: DefaultTokenObject,
  buyToken: DefaultTokenObject,
  sellTokenBalance: BigNumber,
  buyTokenBalance: BigNumber,
  needsTokens: boolean,
  resettable: boolean,
  openOverlay(): any
  swapTokensInAPairAndReCalcClosingPrice(): any,
  resetTokenPair(): any,
}

const TokenPair: React.SFC<TokenPairProps> = ({
  sellToken,
  buyToken,
  sellTokenBalance,
  buyTokenBalance,
  openOverlay,
  swapTokensInAPairAndReCalcClosingPrice,
  needsTokens,
  resetTokenPair,
  resettable,
}) =>
    // If no tokenlist with actual tokens has been uploaded yet, we add the class 'noTokenList' here. Regard this as the init. state
    <div className={needsTokens ? 'tokenPair' : 'tokenPair noTokenList'}>
      {sellToken ?
        <TokenItem
          {...sellToken}
          name={sellToken.name || code2tokenMap[sellToken.symbol]}
          balance={sellTokenBalance}
          mod="sell"
          onClick={openOverlay}
        />
      :
        <NoTokenItem
          mod="sell"
          onClick={openOverlay}
        />
      }

      {/* On click of this button, it should switch the token pair */}
      {needsTokens
        ? <span className="tokenPairSwitcher" onClick={swapTokensInAPairAndReCalcClosingPrice}></span>
        : <span>Upload a token list before picking a token pair. Read more in our <a href="#" target="_blank">FAQ</a> on how it works.</span>
      }

      {buyToken ?
        <TokenItem
          {...buyToken}
          name={buyToken.name || code2tokenMap[buyToken.symbol]}
          balance={buyTokenBalance}
          mod="buy"
          onClick={openOverlay}
        />
        :
        <NoTokenItem
          mod="buy"
          onClick={openOverlay}
        />
      }
      {resettable && <button className="buttonReset" onClick={resetTokenPair}>reset</button>}
    </div>

export default TokenPair
