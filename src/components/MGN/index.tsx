import React from 'react'
import './styles.scss'
import MGN, { MGNprops } from './MGN'
import { promisedContractsMap } from 'api/contracts'
import { MGNInterface } from 'api/types'

interface WaitForContractState {
  mgn: MGNInterface
}

class WaitForContract extends React.Component<Exclude<MGNprops, 'mgn'>, WaitForContractState> {
  state: WaitForContractState = { mgn: null }
  unmounted = false
  componentDidMount() {
    promisedContractsMap().then(contracts => {
      if (this.unmounted) return
      this.setState({ mgn: contracts.TokenMGN })
    })
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  render() {
    if (!this.state.mgn) return null

    return <MGN mgn={this.state.mgn} {...this.props} />
  }
}

export default WaitForContract
