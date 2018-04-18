import { connect } from 'react-redux'
import TokenPicker, { TokenPickerProps } from 'components/TokenPicker'
import { continueToOrder, setTokenListType } from 'actions'

import { State } from 'types'

const mapState = ({ ipfs: { fileBuffer, fileHash }, tokenList: { customTokenList, type } }: State) => ({
  fileBuffer,
  needsTokens: type === 'UPLOAD' || !(fileHash && customTokenList.length > 0),
})

export default connect<Partial<TokenPickerProps>, {}, Pick<TokenPickerProps, 'to'>>
  (mapState, { continueToOrder, setTokenListType })(TokenPicker)
