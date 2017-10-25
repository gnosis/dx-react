import React from 'react'
import TokenItem from '../TokenItem'
import { code2tokenMap, TokenCode } from 'globals'


interface TokenListProps {
  tokens: TokenCode[],
  balances: {[code in TokenCode]: number }
}

const TokenList: React.SFC<TokenListProps> = ({ tokens, balances }) => (
  <div className="tokenList">
    {tokens.map(code =>
      <TokenItem name={code2tokenMap[code]} code={code} balance={balances[code]} key={code} />)}
  </div>
)

export default TokenList
