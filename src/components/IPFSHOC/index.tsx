import React from 'react'

import { promisedIPFS } from 'api/IPFS'
import { FileBuffer } from 'types'
import { readFileUpload } from 'api/utils'
import { DefaultTokenObject } from 'api/types'

export interface HOCState {
  customTokenList: DefaultTokenObject[] | any,
  defaultTokenList: DefaultTokenObject[],
  oFile?: File,
  fileContent?: string;
  fileBuffer?: FileBuffer,
  fileHash?: string,
  filePath?: string,
  setUploadFileParams({}): void,
  setIPFSFileHashAndPath({}): void,
  getFileContentFromIPFS({}): void,
  openModal({}): void,
  needsTokens(): boolean,
}

// HOC that injects IPFS node instructions
export default (WrappedComponent: React.SFC<any> | React.ComponentClass<any>) => {
  return class extends React.Component<HOCState, any> {

    handleFileUpload = async ({ target: { files } }: any) => {
      const [oFile] = files
      const { setUploadFileParams, openModal } = this.props

      console.warn('Detected change: ', oFile)
      if (!oFile) {
        return openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `File Upload Error`,
            body: `
            Please check that you correctly selected a valid JSON file less than 1MB.
            File must be formatted specifically as discussed here: https://some-site.com
            `,
            button: true,
            error: 'Please select a valid JSON file less than 1mb',
          },
        })
      }

      // HTML5 API to read file and set state as contents
      const fileBuffer = await readFileUpload(oFile)

      // setState
      return setUploadFileParams({ oFile, fileBuffer })
    }

    handleSendToIPFS = async () => {
      const { ipfsAddFile } = await promisedIPFS, { fileBuffer, oFile, setIPFSFileHashAndPath, openModal } = this.props
      try {
        const { fileHash, filePath } = await ipfsAddFile(fileBuffer, oFile)

        //setState
        return setIPFSFileHashAndPath({
          fileHash,
          filePath,
        })
      } catch (error) {
        console.error(error)
        return openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `IPFS Send Error`,
            button: true,
            error,
          },
        })
      }
    }

    handleGrabFromIPFS = async () => {
      const { ipfsGetAndDecode } = await promisedIPFS, { fileHash, getFileContentFromIPFS, openModal } = this.props
      try {
        const fileContent = await ipfsGetAndDecode(fileHash)

        // setState
        return getFileContentFromIPFS({ fileContent })
      } catch (error) {
        console.error(error)
        return openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `IPFS Retreive Error`,
            button: true,
            error,
          },
        })
      }
    }

    render() {
      return (
        <WrappedComponent
          handleFileUpload = {this.handleFileUpload}
          handleSendToIPFS = {this.handleSendToIPFS}
          handleGrabFromIPFS = {this.handleGrabFromIPFS}
          {...this.props}
        />
      )
    }
  }
}
