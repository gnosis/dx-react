import { handleActions } from 'redux-actions'

import { setUploadFileParams, setIPFSFileHashAndPath, getFileContentFromIPFS } from 'actions/ipfs'

export const reducer = handleActions(
  {
    [setUploadFileParams.toString()]: (state: {}, action: any) => {
      const { oFile, fileBuffer, json } = action.payload
      return {
        ...state,
        oFile,
        fileBuffer,
        json,
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
    fileBuffer: null,
    fileHash: '',
    filePath: '',
    fileContent: '',
    json: null,
  },
)

export default reducer
