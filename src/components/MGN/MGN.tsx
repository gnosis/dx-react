import React from 'react'
import { Info, Misc } from './Info'
import { YourBalance, AccountBalance } from './BalanceDisplays'
import Controls from './Controls'
import { MGNInterface, TransactionObject } from 'api/types'
import { getMGNapi, MGNbalances, getMGNbalances, getConditions, Wrap, Conditions } from './helpers'
import { network2URL } from 'globals'

export interface MGNprops {
  currentAccount: string;
  now: number;
  mgn: MGNInterface;
  network: string;
}

interface MGNstate {
  conditions: Conditions,
  yourBalances: MGNbalances,
  otherBalances: MGNbalances,
  otherAccount: string,
  txInProgress: { name: string | null, error: Error | null },
}

const initBal: MGNbalances = {
  locked: null,
  unlocking: null,
  unlocked: null,
  whenUnlocked: null,
}

const getEtherscanURL = ({ network, address }: {network: string, address: string}) =>
  `${network2URL[network]}token/${address}`

class MGN extends React.Component<MGNprops, MGNstate> {
  setTxInProgress = (tx: MGNstate['txInProgress']) => {
    this.setState({
      txInProgress: tx,
    })
  }

  wrapInProgress: Wrap = (
    cb,
    name,
    // don't pass tx unless need to set gas or something
  ) => async () => {
    const tx = { from: this.props.currentAccount }
    let res
    try {
      this.setTxInProgress({ name, error: null })
      res = await cb(tx)
    } catch (error) {
      if (!error.message.includes('User denied transaction signature')) console.error(`Error calling ${name}`, error.message)
      this.setTxInProgress({ error, name: null })
    } finally {
      this.setTxInProgress({ error: null, name: null })
    }
    return res
  }
  unmounted = false
  mgnAPI = getMGNapi({ mgn: this.props.mgn })

  state: MGNstate = {
    conditions: {
      canLock: false,
      canUnlock: false,
      canWithdraw: false,
    },
    yourBalances: initBal,
    otherBalances: initBal,
    otherAccount: null,
    txInProgress: { name: null, error: null },
  }

  setMGNBalances = async () => {
    const yourBalances = await getMGNbalances({
      mgn: this.props.mgn, account: this.props.currentAccount,
    })
    const otherBalances = this.state.otherAccount ?
      await getMGNbalances({ mgn: this.props.mgn, account: this.state.otherAccount }) :
      initBal
    if (this.unmounted) return
    this.setState({
      yourBalances,
      otherBalances,
    })
  }

  setConditions = async () => {
    const conditions = await getConditions({
      balances: this.state.yourBalances,
      now: this.props.now,
      txInProgress: this.state.txInProgress,
    })

    this.setState({ conditions })
  }

  async componentDidMount() {
    await this.setMGNBalances()
    await this.setConditions()
  }

  async componentDidUpdate(prevProps: MGNprops, prevState: MGNstate) {
    if (
      prevProps.now !== this.props.now ||
      prevState.otherAccount !== this.state.otherAccount ||
      prevProps.currentAccount !== this.props.currentAccount
    ) {
      await this.setMGNBalances()
      await this.setConditions()
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  setOtherAccount = (acc: string) => {
    this.setState({
      otherAccount: acc,
    })
  }

  lockTokens = (tx: TransactionObject) => {
    return this.mgnAPI.lockTokens(this.state.yourBalances.unlocked, tx)
  }
  unlockTokens = (tx: TransactionObject) => {
    console.log('Unlocking')
    return this.mgnAPI.unlockTokens(tx)
  }
  withdrawUnlockedTokens = (tx: TransactionObject) => {
    return this.mgnAPI.withdrawUnlockedTokens(tx)
  }

  api = {
    lockTokens: this.wrapInProgress(this.lockTokens, 'lockTokens'),
    unlockTokens: this.wrapInProgress(this.unlockTokens, 'unlockTokens'),
    withdrawUnlockedTokens: this.wrapInProgress(this.withdrawUnlockedTokens, 'withdrawUnlockedTokens'),
  }

  render() {
    const { currentAccount, now, mgn, network } = this.props
    const { conditions, yourBalances, otherBalances } = this.state

    const mgnhref = getEtherscanURL({ network, address: mgn.address })

    return (
      <section className="mgn-section">
        <div className="MGN">
          <div className="info">
            <Info mgnhref={mgnhref} />
          </div>
          <div className="displays">
            <YourBalance balances={yourBalances} now={now} account={currentAccount} />
            <AccountBalance
              balances={otherBalances}
              setAccount={this.setOtherAccount}
              now={now}
            />
          </div>
          <div>
            <Controls
              api={this.api}
              conditions={conditions}
              now={now}
              then={yourBalances.whenUnlocked && yourBalances.whenUnlocked.toNumber()}
              mgnhref={mgnhref}
            />
          </div>
          <Misc className="misc" />
        </div>
      </section>
    )
  }
}

export default MGN
