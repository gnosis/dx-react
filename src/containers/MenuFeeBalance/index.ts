import { connect } from 'react-redux'

import MenuFeeBalance from 'components/MenuFeeBalance'

import { State } from 'types'

const mapState = ({ blockchain: { feeRatio, mgnSupply } }: State) => ({
  feeRatio,
  mgnSupply,
})

export default connect(mapState)(MenuFeeBalance)
