import { connect } from 'react-redux'
import TokenPicker from 'components/TokenPicker'
import { continueToOrder } from 'actions'

import { HOCState } from 'components/IPFSHOC'
import { State } from 'types'

const mapState = ({ ipfs: { fileBuffer, fileHash }, tokenList: { customTokenList } }: State) => ({
  fileBuffer,
  needsTokens: !(fileHash && customTokenList),
})

export default connect<Partial<HOCState>, { continueToOrder(): void }, { to: string }>(mapState, { continueToOrder })(TokenPicker)
