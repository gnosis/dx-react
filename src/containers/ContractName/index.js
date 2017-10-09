import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getContractInfo } from 'selectors/blockchain'

const ContractName = ({ contract, contractAddress }) => {
  if (contract) {
    return <span>{contract.name}</span>
  }

  return <span>{contractAddress}</span>
}

ContractName.propTypes = {
  contract: PropTypes.shape({
    name: PropTypes.string,
  }),
  contractAddress: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
  contract: getContractInfo(state)(ownProps.contractId),
})

export default connect(mapStateToProps)(ContractName)
