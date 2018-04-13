import React from 'react'
import TokenItem, { TokenItemProps } from '../TokenItem'
import { code2tokenMap } from 'globals'
import { TokenCode, TokenBalances, State } from 'types'


interface TokenListProps {
  tokens: TokenCode[],
  balances: TokenBalances,
  onTokenClick(props: TokenItemProps): any,
  approvedTokens: State['approvedTokens'],
}

const TokenList: React.SFC<TokenListProps> = ({ tokens, balances, onTokenClick, approvedTokens }) => (
  <div className="tokenList">
    {tokens.map(code =>
      <TokenItem
        name={code2tokenMap[code]}
        code={code}
        balance={balances[code]}
        key={code}
        onClick={onTokenClick}
        generatesMGN={approvedTokens.has(code)}
      />,
    )}
  </div>
)

export default TokenList
