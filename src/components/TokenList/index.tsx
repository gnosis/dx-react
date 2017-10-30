import React from 'react'
import TokenItem, { TokenItemProps } from '../TokenItem'
import { code2tokenMap } from 'globals'
import { TokenCode, TokenBalances } from 'types'


interface TokenListProps {
  tokens: TokenCode[],
  balances: TokenBalances,
  onTokenClick(props: TokenItemProps): any
}

const TokenList: React.SFC<TokenListProps> = ({ tokens, balances, onTokenClick }) => (
  <div className="tokenList">
    {tokens.map(code =>
      <TokenItem name={code2tokenMap[code]} code={code} balance={balances[code]} key={code} onClick={onTokenClick} />)}
  </div>
)

export default TokenList
