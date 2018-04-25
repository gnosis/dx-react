import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getCurrentBalance, getAccount } from 'selectors/blockchain'
import { State, DefaultTokenObject } from 'types'

import { MenuWallet, WalletProps } from 'components/MenuWallet'

const getTokenList = (state: State) => state.tokenList.type === 'DEFAULT' ? state.tokenList.defaultTokenList : state.tokenList.combinedTokenList

const tokenNamesAndDecimals = createSelector(
  getTokenList,
  tokenList => tokenList.reduce((acc: {}, tok: DefaultTokenObject) => {
    acc[tok.address] = {
      name: tok.symbol || tok.name || tok.address || 'Unknown Token',
      decimals: tok.decimals,
    }

    return acc
  }, {}),
)

const mapStateToProps = (state: State) => ({
  account: getAccount(state),
  addressToSymbolDecimal: tokenNamesAndDecimals(state),
  balance: getCurrentBalance(state),
  tokens: state.tokenBalances,
})

export default connect<WalletProps>(mapStateToProps)(MenuWallet)
