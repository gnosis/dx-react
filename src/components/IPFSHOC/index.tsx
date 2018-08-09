import React from 'react'

import { promisedIPFS } from 'api/IPFS'
import { DefaultTokenObject } from 'api/types'
import { getAllTokenDecimals } from 'api'

import localForage from 'localforage'
import { timeoutCondition, checkTokenListJSON } from 'utils'

const IPFS_TIMEOUT = 7000

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

    state = {}

    handleFileHashInput = ({ target: { value } }: any) => this.props.setIPFSFileHash(value)

    handleGrabFromIPFS = async () => {
      const { fileHash, openModal, setIPFSFileHash, setNewIPFSCustomListAndUpdateBalances } = this.props

      try {
        const { ipfsFetchFromHash } = await promisedIPFS

        this.setState({ pullingData: true, error: null })

        const fileContent: any = await Promise.race([
          ipfsFetchFromHash(fileHash),
          timeoutCondition(IPFS_TIMEOUT, 'IPFS timeout, please check hash and try again'),
        ])

        const json = fileContent

        await checkTokenListJSON(json)

        const customTokenListWithDecimals = await getAllTokenDecimals(json)

        localForage.setItem('customListHash', fileHash)
        localForage.setItem('customTokens', customTokenListWithDecimals)

        this.setState({ pullingData: false })

        // setState
        return setNewIPFSCustomListAndUpdateBalances({ customTokenList: customTokenListWithDecimals })
      } catch (error) {
        console.error(error)
        this.setState({ pullingData: false, error })
        // reset hash to empty string
        setIPFSFileHash('')

        return openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `IPFS Download Error`,
            body: 'Please check error message below or open developer console for more details',
            button: true,
            error: error.message || error || 'Unknown error occurred, please open your developer console',
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
          {...this.state}
        />
      )
    }
  }
}
