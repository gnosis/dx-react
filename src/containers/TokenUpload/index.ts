import { connect } from 'react-redux'

import { setUploadFileParams, setIPFSFileHashAndPath } from 'actions/ipfs'

import IPFSHOC from 'components/IPFSHOC'
import TokenUpload from 'components/TokenUpload'

interface TokenUploadState {
  ipfs: {
    fileBuffer: any;
    oFile: any;
    fileHash: any;
    filePath: any;
  }
}

const mapState = ({ ipfs: { fileBuffer, oFile, fileHash, filePath } }: TokenUploadState) => ({
  fileBuffer,
  oFile,
  fileHash,
  filePath,
})

export default connect(mapState, { setUploadFileParams, setIPFSFileHashAndPath })(IPFSHOC(TokenUpload) as any)
