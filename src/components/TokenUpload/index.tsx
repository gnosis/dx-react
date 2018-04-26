import React from 'react'
import ButtonCTA from 'components/ButtonCTA'

import IPFSHOC from 'components/IPFSHOC'
import { DefaultTokenObject } from 'api/types'

interface TokenUploadProps {
  handleSendToIPFS(): void;
  handleFileUpload(): void;
  setTokenListType({}): void;
  customTokenList: DefaultTokenObject[];
  // IPFS
  fileContent?: string;
  fileBuffer?: ArrayBuffer;
  fileHash?: string;
  filePath?: string
  json?: Object;
  oFile?: File;
}
// TODO: add link URL in line 26
const TokenUpload = ({
  customTokenList,
  fileBuffer,
  handleFileUpload,
  handleSendToIPFS,
  setTokenListType,
}: TokenUploadProps) => {
  return (
    <div className="tokenUpload">
      <span className="icon-tokenUpload" />
      <h2>Upload Token List</h2>

      <p>
        Upload a list of tokens to be added and start trading.
        JSON formatted files are supported with a max. filesize of 1MB.
      <br />
        Read our <a href="#">FAQ</a> on how this works.
      </p>

      <form>
        <input
          accept="application/json,.json"
          name="tokenListFile"
          onChange={handleFileUpload}
          type="file"
        />
        <ButtonCTA
          className={fileBuffer ? 'blue' : 'buttonCTA-disabled'}
          onClick={handleSendToIPFS}
        >
          {fileBuffer ? 'Upload' : 'Select file'}
        </ ButtonCTA>
      </form>

      {customTokenList.length > 0 && <a className="showTokenUpload" onClick={(e) => (e.preventDefault(), setTokenListType({ type: 'CUSTOM' }))}>Use pre-existing custom token list</a>}
      <a className="showTokenUpload" onClick={(e) => (e.preventDefault(), setTokenListType({ type: 'DEFAULT' }))}>Use default token list</a>
    </div>
  )
}

export default IPFSHOC(TokenUpload)
