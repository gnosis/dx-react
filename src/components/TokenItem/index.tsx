import React from 'react'
import { TokenMod, BigNumber, DefaultTokenObject } from 'types'

export interface TokenItemProps extends DefaultTokenObject {
  onClick?(props: TokenItemProps): any,
  mod?: TokenMod,
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

export const NoTokenItem: React.SFC<{ onClick: (rest: any) => void, mod: string }> = ({ onClick, ...rest }) => {
  const { mod } = rest
  return (
    <div className="tokenItem" onClick={onClick && (() => onClick(rest))}>
      {mod && <strong>{mod2Title[mod] || mod}</strong>}
      <i data-coin="TOKEN_LIST"></i>
      <big>SELECT TOKEN &#9662;</big>
    </div>
  )
}

const TokenItem: React.SFC<TokenItemProps> = ({ onClick, ...rest }) => {
  const { mod, balance, name, symbol, decimals } = rest
  return (
    <div className="tokenItem" onClick={onClick && (() => onClick(rest))}>
      {mod && <strong>{mod2Title[mod] || mod}</strong>}

      {/* Token image / icon */}
      <i data-coin={tokenSVG.has(symbol) ? symbol : 'DEFAULT_TOKEN'}></i>

      <big>{name}</big><code>{symbol}</code>
      <small>{mod && (mod === 'sell' ? 'AVAILABLE' : 'CURRENT')} BALANCE:</small>
      <p className={balance ? undefined : 'noBalance'}>{balance.div ? balance.div(10 ** decimals).toFixed(4) : balance} {symbol}</p>

    </div>
  )
}

export default TokenItem
