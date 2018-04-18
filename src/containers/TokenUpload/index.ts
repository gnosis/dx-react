import { connect } from 'react-redux'

import { setUploadFileParams, getFileContentFromIPFS, openModal, batchTokenListTypeAndFileParams, setTokenListType } from 'actions'

import IPFSHOC from 'components/IPFSHOC'
import TokenUpload from 'components/TokenUpload'

import { State } from 'types'

const mapState = ({
  ipfs: {
    fileBuffer,
    oFile,
    fileHash,
    filePath,
    fileContent,
    json,
  },
  tokenList: {
    customTokenList,
  },
}: Partial<State>) => ({
  fileBuffer,
  oFile,
  fileHash,
  filePath,
  fileContent,
  json,
  customTokenList,
})

export default connect(
  mapState,
  {
    getFileContentFromIPFS,
    openModal,
    batchTokenListTypeAndFileParams,
    setTokenListType,
    setUploadFileParams,
  })(IPFSHOC(TokenUpload) as any)
