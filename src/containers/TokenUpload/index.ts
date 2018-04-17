import { connect } from 'react-redux'

import { setUploadFileParams, setIPFSFileHashAndPath, getFileContentFromIPFS, openModal, setCustomTokenList } from 'actions'

import IPFSHOC from 'components/IPFSHOC'
import TokenUpload from 'components/TokenUpload'

import { State } from 'types'

import { batchActions } from 'redux-batched-actions'
import { createAction } from 'redux-actions'
import { DefaultTokenObject } from 'api/types'

export interface TokenListType {
  CUSTOM: 'CUSTOM',
  DEFAULT: 'DEFAULT',
  UPLOAD: 'UPLOAD',
}

export const setTokenListType = createAction<{ type: TokenListType['CUSTOM' | 'DEFAULT' | 'UPLOAD'] }>('SET_TOKEN_LIST_TYPE')

export const batchTokenListTypeAndFileParams = (p1: { customTokenList: DefaultTokenObject[] }, p2: {}) => batchActions([
  setCustomTokenList(p1),
  setIPFSFileHashAndPath(p2),
])

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
