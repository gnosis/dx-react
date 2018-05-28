import React from 'react'
import ButtonCTA from 'components/ButtonCTA'
import Loader from 'components/Loader'

import { DefaultTokenObject } from 'api/types'

interface TokenUploadProps {
  handleFileHashInput(): void;
  handleGrabFromIPFS(): void;
  setTokenListType({}): void;
  customTokenList: DefaultTokenObject[];
  pullingData: boolean;

  // IPFS
  potentiallyValidHash?: boolean;
  fileHash?: string;
  filePath?: string;
  json?: Object;
  oFile?: File;
}
// TODO: add link URL in line 45
const TokenUpload = ({
  customTokenList,
  potentiallyValidHash,
  handleFileHashInput,
  handleGrabFromIPFS,
  setTokenListType,
  fileHash,
  pullingData,
}: TokenUploadProps) => {
  return (
    <Loader
      hasData={!pullingData}
      message={`Checking IPFS for hash: ${fileHash}...`}
      reSize={0.85}
      render={() =>
        <div className="tokenUpload">
          <span className="icon-tokenUpload" />
          <h2>Download Token List</h2>

          <p>
            Download a list of tokens to be added and start trading.
            JSON formatted files are supported with a max filesize of 1MB.
          <br />
            Read our <a href="#">FAQ</a> on how this works.
          </p>

          <form>
            <input
              className="inputText"
              name="tokenListHash"
              onChange={handleFileHashInput}
              type="text"
              value={fileHash}
            />

            <ButtonCTA
              className={potentiallyValidHash ? 'blue' : 'buttonCTA-disabled'}
              id="ipfsDownload"
              onClick={handleGrabFromIPFS}
            >
              {potentiallyValidHash ? 'Download' : 'Enter Hash'}
            </ ButtonCTA>
          </form>

          {customTokenList.length > 0 && <a className="showTokenUpload" onClick={(e) => (e.preventDefault(), setTokenListType({ type: 'CUSTOM' }))}>Use pre-existing custom token list</a>}
          <a className="showTokenUpload" onClick={(e) => (e.preventDefault(), setTokenListType({ type: 'DEFAULT' }))}>Use default token list</a>
        </div>
      }
    />
  )
}

export default TokenUpload
