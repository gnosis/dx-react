import React from 'react'
import { TokenMod, BigNumber, DefaultTokenObject, TokenName } from 'types'
import { FIXED_DECIMALS, tokenSVG } from 'globals'

export interface TokenItemProps extends DefaultTokenObject {
  onClick?(props: TokenItemProps): any,
  mod?: TokenMod,
  name: TokenName,
  generatesMGN?: boolean,
  balance: BigNumber | number,
}

const mod2Title: {[P in TokenMod]: string} = {
  sell: 'DEPOSIT',
  buy: 'RECEIVE',
}

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

const TokenItem: React.SFC<TokenItemProps> = ({ onClick, generatesMGN = true, ...rest }) => {
  const { mod, balance, name, symbol, decimals, address } = rest

  return (
    <div className="tokenItem" onClick={onClick && (() => onClick(rest))}>
      {mod && <strong>{mod2Title[mod] || mod}</strong>}

      {/* Token image / icon */}
      <i data-coin={tokenSVG.has(symbol) ? symbol : 'DEFAULT_TOKEN'}></i>

      <big>{name}</big><code>{symbol}</code>
      <small>{mod && (mod === 'sell' ? 'AVAILABLE' : 'CURRENT')} BALANCE:</small>
      <p className={balance ? undefined : 'noBalance'}>{typeof balance !== 'number' && balance.div ? balance.div(10 ** decimals).toFixed(FIXED_DECIMALS) : balance} {symbol}</p>
      {!generatesMGN && <p className="noMGN">Any auction with <strong>{symbol || address}</strong> won't generate MGN</p>}
    </div>
  )
}

export default TokenItem
