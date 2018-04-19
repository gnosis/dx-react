import React, { Component } from 'react'
import TokenOverlayHeader from '../TokenOverlayHeader'
import TokenList from '../TokenList'
import { code2tokenMap } from 'globals'
import { TokenBalances, TokenMod, DefaultTokenObject } from 'types'
import { TokenItemProps } from '../TokenItem'
import { createSelector } from 'reselect'

const filterTokens = createSelector(
  (state: TokenOverlayState, _: TokenOverlayProps) => state.filter.toUpperCase(),
  (_, props) => props.tokenList,
  (filter, tokens) => (filter ?
    tokens.filter(({
      symbol = '',
      name = code2tokenMap[symbol] || '',
    }) => symbol.includes(filter) || name.includes(filter)) :
    tokens
  ),
)

export interface TokenOverlayProps {
  tokenList: DefaultTokenObject[],
  closeOverlay(): any,
  selectTokenPairAndRatioPair(props: Partial<TokenItemProps>): any,
  tokenBalances: TokenBalances,
  open: boolean,
  mod: TokenMod,
}

interface TokenOverlayState {
  filter: string
}

class TokenOverlay extends Component<TokenOverlayProps, TokenOverlayState> {
  state = {
    filter: '',
  }

  changeFilter = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
    filter: e.target.value,
  })

  selectTokenAndCloseOverlay: TokenOverlayProps['selectTokenPairAndRatioPair'] = (tokenProps) => {
    const { selectTokenPairAndRatioPair, mod } = this.props

    selectTokenPairAndRatioPair({ ...tokenProps, mod })
  }

  closeOverlay = () => {
    this.props.closeOverlay()
    this.setState({ filter: '' })
  }


  render() {
    if (!this.props.open) return null

    const { tokenBalances } = this.props
    const { filter } = this.state

    const filteredTokens = filterTokens(this.state, this.props)

    return (
      <div className="tokenOverlay">
        <TokenOverlayHeader
          onChange={this.changeFilter}
          closeOverlay={this.closeOverlay}
          value={filter}
        />
        <TokenList
          tokens={filteredTokens}
          balances={tokenBalances}
          onTokenClick={this.selectTokenAndCloseOverlay}
        />
      </div>
    )
  }
}

export default TokenOverlay
