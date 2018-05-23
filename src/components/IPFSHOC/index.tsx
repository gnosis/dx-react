import React from 'react'

import { promisedIPFS } from 'api/IPFS'
import { FileBuffer } from 'types'
import { readFileUpload, readFileAsText, checkTokenListJSON } from 'api/utils'
import { DefaultTokenObject } from 'api/types'

import localForage from 'localforage'
import { getAllTokenDecimals } from 'api'

export interface HOCState {
  customTokenList: DefaultTokenObject[] | any;
  defaultTokenList: DefaultTokenObject[];
  needsTokens: boolean;
  // IPFS
  fileContent?: string;
  fileBuffer?: FileBuffer;
  fileHash?: string;
  filePath?: string;
  oFile?: File;
  json?: DefaultTokenObject[];

  setNewIPFSCustomListAndUpdateBalances({}, {}): void;
  getFileContentFromIPFS({}): void;
  openModal({}): void;
  setIPFSFileHashAndPath({}): void;
  setTokenListType({}): void;
  setUploadFileParams({}): void,
}

// HOC that injects IPFS node instructions
export default (WrappedComponent: React.SFC<any> | React.ComponentClass<any>) => {
  return class extends React.Component<HOCState, any> {

    handleFileUpload = async ({ target: { files } }: any) => {
      const [oFile] = files
      const { setUploadFileParams, openModal } = this.props

      console.warn('Detected change: ', oFile)
      // File dialog was cancelled
      if (!oFile) {
        return setUploadFileParams({
          oFile: {},
          fileBuffer: null,
          json: null,
        })
      }

      try {
        // TODO: 39-44 optimize execution
        const text = await readFileAsText(oFile)
        const json = JSON.parse(text)

        await checkTokenListJSON(json)

        // HTML5 API to read file and set state as contents
        const fileBuffer = await readFileUpload(oFile)

        // setState
        return setUploadFileParams({ oFile, fileBuffer, json })
      } catch (error) {
        console.error(error)
        return openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `File Upload Error`,
            body: `
            Please check that you correctly selected a valid JSON file less than 1MB.
            File must be formatted specifically as discussed here: https://some-site.com
            `,
            button: true,
            error: error.message || 'Unknown error occurred, please open your developer console',
          },
        })
      }

    }

    handleSendToIPFS = async () => {
      const { ipfsAddFile } = await promisedIPFS
      const { fileBuffer, oFile, json, setNewIPFSCustomListAndUpdateBalances, openModal } = this.props
      try {
        const { fileHash, filePath } = await ipfsAddFile(fileBuffer, oFile),
          customTokenListWithDecimals = await getAllTokenDecimals(json)

        localForage.setItem('customListHash', fileHash)

        // setState
        return setNewIPFSCustomListAndUpdateBalances(
          {
            customTokenList: customTokenListWithDecimals,
          },
          {
            fileHash,
            filePath,
          },
        )
      } catch (error) {
        console.error(error)
        return openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `IPFS Send Error`,
            button: true,
            error: error.message || 'Unknown error occurred, please open your developer console',
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
            error: error.message || 'Unknown error occurred, please open your developer console',
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
