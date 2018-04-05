import { handleActions } from 'redux-actions'

import { setUploadFileParams, setIPFSFileHashAndPath, getFileContentFromIPFS } from 'actions/ipfs'

export const reducer = handleActions(
  {
    [setUploadFileParams.toString()]: (state: {}, action: any) => {
      const { oFile, fileBuffer } = action.payload
      return {
        ...state,
        oFile,
        fileBuffer,
      }
    },
    [setIPFSFileHashAndPath.toString()]: (state: {}, action: any) => {
      const { fileHash, filePath } = action.payload
      return {
        ...state,
        fileHash,
        filePath,
      }
    },
    [getFileContentFromIPFS.toString()]: (state: {}, action: any) => {
      const { fileContent } = action.payload
      return {
        ...state,
        fileContent,
      }
    },
  },
  {
    oFile: {},
    fileBuffer: [],
    fileHash: '',
    filePath: '',
    fileContent: '',
  },
)

export default reducer
