import { connect } from 'react-redux'
import TokenPicker from 'components/TokenPicker'
import { continueToOrder } from 'actions'

import { HOCState } from 'components/IPFSHOC'

const mapState = ({ ipfs: { fileBuffer, fileHash } }: any) => ({
  fileBuffer,
  fileHash,
})

export default connect<Partial<HOCState>, { continueToOrder(): void }, { to: string }>(mapState, { continueToOrder })(TokenPicker)
