import React, { Component } from 'react'
import { createSelector } from 'reselect'

import TokenOverlayHeader from '../TokenOverlayHeader'
import TokenList from '../TokenList'

import { code2tokenMap } from 'globals'
import { DefaultTokenObject, TokenBalances, TokenMod, AccountsSet } from 'types'
import Loader from '../Loader'

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

const dataLengthCheck = (o1: {} | any[], o2: {} | any[]) => {
  const o1kl = Array.isArray(o1) ? o1.length : Object.keys(o1).length,
		    o2kl = Array.isArray(o2) ? o2.length : Object.keys(o2).length

	 return o1kl <= o2kl
}

export interface TokenOverlayProps {
  tokenList: DefaultTokenObject[],
  closeOverlay(): any,
  selectTokenPairAndRatioPair(props: any): any,
  tokenBalances: TokenBalances,
  open: boolean,
  mod: TokenMod,
  approvedTokens: AccountsSet,
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
    console.log('tokenProps: ', tokenProps)
    const { selectTokenPairAndRatioPair, mod } = this.props

    selectTokenPairAndRatioPair({ token: tokenProps, mod })
  }

  closeOverlay = () => {
    this.props.closeOverlay()
    this.setState({ filter: '' })
  }


  render() {
    if (!this.props.open) return null

    const { tokenBalances, approvedTokens } = this.props
    const { filter } = this.state

    const filteredTokens = filterTokens(this.state, this.props)

    return (
      <div className="tokenOverlay">
        <TokenOverlayHeader
          onChange={this.changeFilter}
          closeOverlay={this.closeOverlay}
          value={filter}
        />
        <Loader
          hasData={dataLengthCheck(filteredTokens, tokenBalances)}
          message="Loading token balances - please wait"
          reSize={0.72}
          render={() =>
          <TokenList
            tokens={filteredTokens}
            balances={tokenBalances}
            onTokenClick={this.selectTokenAndCloseOverlay}
            approvedTokens={approvedTokens}
          />
        } />
      </div>
    )
  }
}

export default TokenOverlay
