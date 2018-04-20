import { connect } from 'react-redux'
import { getCurrentBalance, getAccount } from 'selectors/blockchain'
import { State } from 'types'

import { MenuWallet, WalletProps } from 'components/MenuWallet'

const mapStateToProps = (state: State) => {
  // TODO: reselect
  const tokenList = state.tokenList.type === 'DEFAULT' ? state.tokenList.defaultTokenList : state.tokenList.combinedTokenList
  const mapTokenListToNames = tokenList.reduce((acc: {}, tok: any) => {
    acc[tok.address] = tok.symbol || tok.name || tok.address | 'Unknown Token'
    return acc
  }, {})
  return {
    account: getAccount(state),
    addressToSymbol: mapTokenListToNames,
    balance: getCurrentBalance(state),
    tokens: state.tokenBalances,
  }
}

export default connect<WalletProps>(mapStateToProps)(MenuWallet)
