import React from 'react'
import { TokenMod, BigNumber, DefaultTokenObject, TokenName } from 'types'

export interface TokenItemProps extends DefaultTokenObject {
  onClick?(props: TokenItemProps): any,
  mod?: TokenMod,
  name: TokenName,
  generatesMGN?: boolean,
  balance: BigNumber,
}

const mod2Title: {[P in TokenMod]: string} = {
  sell: 'SELL',
  buy: 'RECEIVE',
}

const tokenSVG = new Set([
  'REP',
  'ETH',
  'GNO',
  'OMG',
  '1ST',
  'GNT',
])

const TokenItem: React.SFC<TokenItemProps> = ({ onClick, generatesMGN = true, ...rest }) => {
  const { mod, balance, name, symbol, decimals, address } = rest
  return (
    <div className="tokenItem" onClick={onClick && (() => onClick(rest))}>
      {mod && <strong>{mod2Title[mod] || mod}</strong>}

      {/* Token image / icon */}
      <i data-coin={tokenSVG.has(symbol) ? symbol : 'DEFAULT_TOKEN'}></i>

      <big>{name}</big><code>{symbol}</code>
      <small>{mod && (mod === 'sell' ? 'AVAILABLE' : 'CURRENT')} BALANCE:</small>
      <p className={balance ? undefined : 'noBalance'}>{balance.div ? balance.div(10 ** decimals).toFixed(4) : balance} {symbol}</p>

      {/*
      MICHEL: We should ONLY show 'noMGN' when 'tokenItem' is displayed inside 'tokenList'.
      Currently this is handled by CSS but we should implement the logic here to not output the element at all.
      */}
      {!generatesMGN && <p className="noMGN">Any auction with <strong>{symbol || address}</strong> won't generate MGN</p>}

      {/* =====================================================================
        DEMO >>> NO PRESELECTED TOKEN for tokenItem in tokenPair
        Adding this example to display when no token has been pre-selected.
      */}
        {mod && <strong>{mod2Title[mod] || mod}</strong>}
        <i data-coin="TOKEN_LIST"></i>
        <big>SELECT TOKEN &#9662;</big>
      {/*
        End example
        =======================================================================
      */}
    </div>
  )
}

export default TokenItem
