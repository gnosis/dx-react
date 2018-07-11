import React, { Component } from 'react'
import { createSelector } from 'reselect'

import TokenOverlayHeader from '../TokenOverlayHeader'
import TokenList from '../TokenList'

import { code2tokenMap } from 'globals'
import { DefaultTokenObject, TokenBalances, TokenMod, AccountsSet, AvailableAuctions, TokenPair, Account } from 'types'
import Loader from '../Loader'
import { handleKeyDown } from 'utils/helpers'

const getTokenModAndAddress = createSelector(
  (_: TokenOverlayState, { mod }: TokenOverlayProps) => mod,
  (_, { tokenPair }) => tokenPair,
  (_, { WETHAddress }) => WETHAddress,
  (mod, tokenPair, WETHAddress) => {
    const oldToken = tokenPair[mod]

    const oldAddress = oldToken &&
      (oldToken.isETH ? WETHAddress : oldToken.address)

    const oppositeToken = tokenPair[mod === 'sell' ? 'buy' : 'sell']
    
    const oppositeAddress = oppositeToken &&
      (oppositeToken.isETH ? WETHAddress : oppositeToken.address)


    return {
      mod,
      // token we clicked on
      oldAddress,
      // opposite in a pair
      oppositeAddress,
      WETHAddress,
    }
  },
)

const prefilterByAvailableAuctions = createSelector(
  (_: TokenOverlayState, props: TokenOverlayProps) => props.tokenList,
  (_, props) => props.availableAuctions,
  (_, { MGNAddress }) => MGNAddress,
  getTokenModAndAddress,
  (tokenList, availableAuctions, MGNAddress, { mod, oppositeAddress, WETHAddress }) => {
    // if opposite token is an empty placeholder, show every token
    if (!oppositeAddress) return tokenList.filter(t => t.address !== MGNAddress)
    return tokenList.filter(token => {
      // don't show opposite token as it's already selected for the other position
      if (token.address === oppositeAddress) return false
      const tokenAddress = token.isETH ? WETHAddress : token.address
      let pairStr
      // if selecting for sell position, check direct pairs with opposite token
      if (mod === 'sell') pairStr = `${oppositeAddress}-${tokenAddress}`
      // otherwise opposite pairs
      else if (mod === 'buy') pairStr = `${tokenAddress}-${oppositeAddress}`
      else throw new Error(`tokenPair.mod isn't set, ${mod}`)
      
      // show only token pairs that would actually allow a sell order
      return availableAuctions.has(pairStr)
    })
  },
)

const filterTokens = createSelector(
  (state: TokenOverlayState, _: TokenOverlayProps) => state.filter.toUpperCase(),
  prefilterByAvailableAuctions,
  (filter, tokens) => (filter ?
    tokens.filter(({
      symbol = '',
      name = code2tokenMap[symbol] || '',
    }: DefaultTokenObject) => symbol.toUpperCase().includes(filter) || name.toUpperCase().includes(filter)) :
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
  tokenPair: TokenPair,
  closeOverlay(): any,
  selectTokenPairAndRatioPair(props: any): any,
  resetTokenPairAndCloseOverlay(): any,
  tokenBalances: TokenBalances,
  open: boolean,
  mod: TokenMod,
  approvedTokens: AccountsSet,
  availableAuctions: AvailableAuctions,
  WETHAddress: Account,
  MGNAddress: Account,
  resettable: boolean,
}

interface TokenOverlayState {
  filter: string
}

class TokenOverlay extends Component<TokenOverlayProps, TokenOverlayState> {
  state = {
    filter: '',
  }

  outerDiv: HTMLDivElement

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

  componentDidMount() {
    this.outerDiv && this.outerDiv.focus()
  }


  render() {
    const { tokenBalances, approvedTokens, closeOverlay, resettable, resetTokenPairAndCloseOverlay } = this.props
    const { filter } = this.state

    const filteredTokens = filterTokens(this.state, this.props)

    return (
      <div className="tokenOverlay" ref={c => this.outerDiv = c} tabIndex={-1} onKeyDown={(e) => handleKeyDown(e, closeOverlay, 'Escape')}>
        <TokenOverlayHeader
          onChange={this.changeFilter}
          closeOverlay={this.closeOverlay}
          value={filter}
          resettable={resettable}
          reset={resetTokenPairAndCloseOverlay}
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
