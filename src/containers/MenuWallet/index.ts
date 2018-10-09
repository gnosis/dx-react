import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getCurrentBalance, getAccount, getProviderName } from 'selectors/blockchain'
import { State, DefaultTokenObject, BigNumber } from 'types'

import { MenuWallet, WalletProps } from 'components/MenuWallet'
import { withdrawFromDutchX, setActiveProvider } from 'actions'
import { ProviderName } from 'globals'

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
  const tokenBalancesValues = Object.values(state.tokenBalances)
  const providerName = getProviderName(state)

  return {
    account: getAccount(state),
    addressToSymbolDecimal: tokenNamesAndDecimals(state),
    balance: getCurrentBalance(state),
    dxBalances: state.dxBalances,
    dxBalancesAvailable: !!(dxBalancesValues.find((i: BigNumber) => i.gt(0))),
    hasTokenBalances: !!(tokenBalancesValues.find(n => n.gt(0))),
    network: state.blockchain.network || 'Connection failed',
    providerName: providerName as ProviderName,
    tokens: state.tokenBalances,
  }
}

export default connect<Partial<WalletProps>>(mapStateToProps, { setActiveProvider, withdrawFromDutchX })(MenuWallet)
