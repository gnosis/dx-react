import { handleActions } from 'redux-actions'

import { setUploadFileParams, setIPFSFileHashAndPath } from 'actions/ipfs'

export const reducer = handleActions(
  {
    [setUploadFileParams as any]: (state: any, action: any) => {
      const { oFile, fileBuffer } = action.payload
      return {
        ...state,
        oFile,
        fileBuffer,
      }
    },
    [setIPFSFileHashAndPath as any]: (state: any, action: any) => {
      const { fileHash, filePath } = action.payload
      return {
        ...state,
        fileHash,
        filePath,
      }
    },
  },
  {
    oFile: undefined,
    fileBuffer: undefined,
    fileHash: undefined,
    filePath: undefined,
  },
)

export default reducer
