import { createAction } from 'redux-actions'

export const setUploadFileParams: Function = createAction<{ oFile: File, fileBuffer: ArrayBuffer, json: Object }>('SET_UPLOAD_FILE_PARAMS')
export const setIPFSFileHashAndPath: Function = createAction<{ fileHash: string, filePath: string }>('SET_IPFS_FILE_HASH_AND_PATH')
export const getFileContentFromIPFS: Function = createAction<{ fileContent: string }>('GET_FILE_CONTENT_FROM_IPFS')
