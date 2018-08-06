import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getCurrentBalance, getAccount } from 'selectors/blockchain'
import { State, DefaultTokenObject, BigNumber } from 'types'

import { MenuWallet, WalletProps } from 'components/MenuWallet'
import { withdrawFromDutchX } from 'actions'

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

const mapStateToProps = (state: State) => {
  const dxBalancesValues = Object.values(state.dxBalances)
  return {
    account: getAccount(state),
    addressToSymbolDecimal: tokenNamesAndDecimals(state),
    balance: getCurrentBalance(state),
    tokens: state.tokenBalances,
    dxBalances: state.dxBalances,
    dxBalancesAvailable: !!(dxBalancesValues.find((i: BigNumber) => i.gt(0))),
  }
}

export default connect<Partial<WalletProps>>(mapStateToProps, { withdrawFromDutchX })(MenuWallet)
