import React from 'react'

import { promisedIPFS } from 'api/IPFS'
import { readFileUpload } from 'api/utils'

/* const statePrint = {
  position: 'fixed', left: 0, top: 0,
  zIndex: 999,
} */

interface HOCState {
  oFile?: any,
  fileContent?: any;
  fileBuffer?: any,
  fileHash?: any,
  filePath?: any,
}

// HOC that injects IPFS node instructions
export default (WrappedComponent: React.SFC<any> | React.ComponentClass<any>) => {
  return class extends React.Component<HOCState, any> {
    state = {} as HOCState

    async componentDidMount() {
      // not really necessary
      const { ipfs: node } = await promisedIPFS
      this.setState({ node })
    }

    handleFileUpload = async ({ target: { files } }: any) => {
      const [oFile] = files
      console.warn('Detected change: ', oFile)
      if (!oFile) throw new Error('No file uploaded')

      // HTML5 API to read file and set state as contents
      const fileBuffer = await readFileUpload(oFile)
      this.setState({ oFile, fileBuffer })
    }

    handleSendToIPFS = async () => {
      const { ipfsAddFile } = await promisedIPFS, { fileBuffer, oFile } = this.state
      try {
        const { fileHash, filePath } = await ipfsAddFile(fileBuffer, oFile)

        this.setState({
          fileHash,
          filePath,
        })
      } catch (error) {
        console.error(error)
        this.setState({
          error,
        })
      }
    }

    handleGrabFromIPFS = async () => {
      const { ipfsGetAndDecode } = await promisedIPFS, { fileHash } = this.state
      try {
        const fileContent = await ipfsGetAndDecode(fileHash)

        this.setState({ fileContent })
      } catch (error) {
        console.error(error)
        this.setState({
          error,
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
          {...this.state}
        />
      )
    }
  }
}
