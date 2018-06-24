import { createAction } from 'redux-actions'
import { DefaultTokenObject } from 'types'

export const setUploadFileParams: Function = createAction<{ oFile: File, fileBuffer: ArrayBuffer, json: DefaultTokenObject[] }>('SET_UPLOAD_FILE_PARAMS')
export const setIPFSFileHash: Function = createAction<string>('SET_IPFS_FILE_HASH')
export const setIPFSFileHashAndPath: Function = createAction<{ fileHash: string, filePath: string }>('SET_IPFS_FILE_HASH_AND_PATH')
export const getFileContentFromIPFS: Function = createAction<{ fileContent: string }>('GET_FILE_CONTENT_FROM_IPFS')
