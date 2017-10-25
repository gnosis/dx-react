import React, { Component } from 'react'
import TokenOverlayHeader from '../TokenOverlayHeader'
import TokenList from '../TokenList'
import { code2tokenMap, TokenCode } from 'globals'
import { createSelector } from 'reselect'

const filterTokens = createSelector(
  (state: TokenOverlayState, _: TokenOverlayProps) => state.filter.toUpperCase(),
  (_: TokenOverlayState, props: TokenOverlayProps) => props.tokenCodeList,
  (filter, codes) => (filter ?
    codes.filter(code => code.includes(filter) || code2tokenMap[code].includes(filter)) :
    codes
  ),
)

interface TokenOverlayProps {
  tokenCodeList: TokenCode[],
  closeOverlay(): void,
  tokenBalances: {[code in TokenCode]: number },
  open: boolean,
}

interface TokenOverlayState {
  filter: string
}

class TokenOverlay extends Component<TokenOverlayProps, TokenOverlayState> {
  state = {
    filter: '',
  }

  static defaultProps: { tokenCodeList: string[] } = {
    tokenCodeList: [],
  }

  changeFilter = (e: React.SyntheticEvent<HTMLInputElement>) => this.setState({
    filter: (e.target as HTMLInputElement).value,
  })


  render() {
    if (!this.props.open) return null

    const { closeOverlay, tokenBalances } = this.props

    const filteredTokens = filterTokens(this.state, this.props)

    return (
      <div className="tokenOverlay">
        <TokenOverlayHeader onChange={this.changeFilter} closeOverlay={closeOverlay} />
        <TokenList tokens={filteredTokens} balances={tokenBalances} />
      </div>
    )
  }
}

export default TokenOverlay
