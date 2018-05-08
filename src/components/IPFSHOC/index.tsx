import React from 'react'

import { promisedIPFS } from 'api/IPFS'
import { checkTokenListJSON } from 'api/utils'
import { DefaultTokenObject } from 'api/types'

import localForage from 'localforage'
import { getAllTokenDecimals } from 'api'

export interface HOCState {
  customTokenList: DefaultTokenObject[] | any;
  defaultTokenList: DefaultTokenObject[];
  needsTokens: boolean;
  // IPFS
  fileHash?: string;
  filePath?: string;
  json?: DefaultTokenObject[];

  openModal({}): void;
  setIPFSFileHash(value: string): void;
  setNewIPFSCustomListAndUpdateBalances({}): void;
  setTokenListType({}): void;
}

// HOC that injects IPFS node instructions
export default (WrappedComponent: React.SFC<any> | React.ComponentClass<any>) => {
  return class extends React.Component<HOCState, any> {

    handleFileHashInput = ({ target: { value } }: any) => this.props.setIPFSFileHash(value)

    handleGrabFromIPFS = async () => {
      const { ipfsGetAndDecode } = await promisedIPFS, { fileHash, openModal, setNewIPFSCustomListAndUpdateBalances } = this.props
      try {
        const fileContent = await ipfsGetAndDecode(fileHash)
        const json = JSON.parse(fileContent)

        await checkTokenListJSON(json)

        const customTokenListWithDecimals = await getAllTokenDecimals(json)

        localForage.setItem('customListHash', fileHash)
        localForage.setItem('customTokenList', customTokenListWithDecimals)

        // setState
        return setNewIPFSCustomListAndUpdateBalances({ customTokenList: customTokenListWithDecimals })
      } catch (error) {
        console.error(error)
        return openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `IPFS Download Error`,
            button: true,
            error: error.message || 'Unknown error occurred, please open your developer console',
          },
        })
      }
    }

    render() {
      return (
        <WrappedComponent
          handleFileHashInput = {this.handleFileHashInput}
          handleGrabFromIPFS = {this.handleGrabFromIPFS}
          {...this.props}
        />
      )
    }
  }
}
