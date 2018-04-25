import React from 'react'
import TokenItem from '../TokenItem'
import { code2tokenMap } from 'globals'
import { TokenBalances, DefaultTokenObject } from 'types'


interface TokenListProps {
  tokens: DefaultTokenObject[],
  balances: TokenBalances,
  onTokenClick(props: any): any
}

const TokenList: React.SFC<TokenListProps> = ({ tokens, balances, onTokenClick }) => (
  <div className="tokenList">
    {tokens.map((token: DefaultTokenObject) =>
      <TokenItem
        {...token}
        name={token.name || code2tokenMap[token.symbol]}
        balance={balances[token.address]}
        key={token.address}
        onClick={onTokenClick}
      />)}
  </div>
)

export default TokenList
