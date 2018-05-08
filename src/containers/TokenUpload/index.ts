import { connect } from 'react-redux'

import {
  setIPFSFileHash,
  setNewIPFSCustomListAndUpdateBalances,
  setTokenListType,
  openModal,
} from 'actions'

import IPFSHOC from 'components/IPFSHOC'
import TokenUpload from 'components/TokenUpload'

import { State } from 'types'

const mapState = ({
  ipfs: {
    fileHash,
    filePath,
    json,
  },
  tokenList: {
    customTokenList,
  },
}: Partial<State>) => ({
  fileHash,
  filePath,
  json,
  customTokenList,
  potentiallyValidHash: fileHash.length == 46,
})

export default connect(
  mapState,
  {
    setIPFSFileHash,
    setNewIPFSCustomListAndUpdateBalances,
    setTokenListType,
    openModal,
  })(IPFSHOC(TokenUpload) as any)
