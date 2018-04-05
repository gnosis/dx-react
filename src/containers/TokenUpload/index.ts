import { connect } from 'react-redux'

import { setUploadFileParams, setIPFSFileHashAndPath, getFileContentFromIPFS, openModal } from 'actions'

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
  } }: Partial<State>) => ({
    fileBuffer,
    oFile,
    fileHash,
    filePath,
    fileContent,
  })

export default connect(
  mapState,
  {
    setUploadFileParams,
    setIPFSFileHashAndPath,
    getFileContentFromIPFS,
    openModal,
  })(IPFSHOC(TokenUpload) as any)
