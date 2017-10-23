import React, { Component } from 'react'
import TokenItem from '../TokenItem'

// TODO: move tokens and codes to global config or redux
const code2tokenMap = {
  ETH: 'ETHER',
  GNO: 'GNOSIS',
  REP: 'AUGUR',
  '1ST': 'FIRST BLOOD',
  OMG: 'OMISEGO',
  GNT: 'GOLEM',
}

interface TokenOverlayProps {
  tokenCodeList: string[],
  // TODO: keep closeOverlay state in redux?
  closeOverlay(): void,
  tokenBalances: { [code: string]: number }
}

interface TokenOverlayState {
  filter: string
}

class TokenOverlay extends Component<TokenOverlayProps, TokenOverlayState> {
  // TODO: consider keeping filter state in redux, if we need to persist
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
    const { tokenCodeList, closeOverlay, tokenBalances } = this.props
    const { filter } = this.state
    const filterUP = filter.toUpperCase()
    // TODO: rewrite filter using reselect
    const filteredTokens = !filter ? tokenCodeList : tokenCodeList.filter(
      code => code.includes(filterUP) || code2tokenMap[code].includes(filterUP),
    )

    // TODO: change <ul> to <div> (to keep with generic <TokenItem/>), including in CSS
    return (
      <div className="tokenOverlay">
        <span className="tokenOverlayHeader">
          <input
            className="tokenSearch"
            type="text"
            name="tokenSearch"
            placeholder="Find token by name or code"
            onChange={this.changeFilter}
          />
          <button className="buttonExit" onClick={closeOverlay} />
        </span>
        <ul>
          {filteredTokens.map(code =>
            <TokenItem name={code2tokenMap[code]} code={code} balance={tokenBalances[code]} key={code} />)}
        </ul>
      </div>
    )
  }
}

export default TokenOverlay
