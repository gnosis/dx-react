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
  },
  tokenPair: {
    sell,
    buy,
  },
}: State) => ({
  fileBuffer,
  needsTokens: type === 'UPLOAD' || !(defaultTokenList.length > 0 || customTokenList.length > 0),
  tokensSelected: !!(sell && buy),
})

export default connect<Partial<TokenPickerProps>, {}, Pick<TokenPickerProps, 'to' | 'showPair'>>
  (mapState, { continueToOrder, setTokenListType })(TokenPicker)
