import { connect } from 'react-redux'
import TokenPicker, { TokenPickerProps } from 'components/TokenPicker'
import { continueToOrder, setTokenListType } from 'actions'

import { State } from 'types'

const mapState = ({
  ipfs: {
    fileBuffer,
  },
  tokenList: {
    customTokenList,
    defaultTokenList,
    type,
    allowUpload,        // TODO: centralized version - set to true in reducers/tokenLists.ts when decentralised
  },
  tokenPair: {
    sell,
    buy,
  },
}: State) => ({
  allowUpload,
  fileBuffer,
  needsTokens: allowUpload && (type === 'UPLOAD' || !(defaultTokenList.length > 0 || customTokenList.length > 0)),
  tokensSelected: !!(sell && buy),
})

export default connect<Partial<TokenPickerProps>, {}, Pick<TokenPickerProps, 'to' | 'showPair'>>
  (mapState, { continueToOrder, setTokenListType })(TokenPicker)
