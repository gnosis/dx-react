import React from 'react'
import ButtonCTA from 'components/ButtonCTA'

import IPFSHOC from 'components/IPFSHOC'

interface TokenUploadProps {
  handleSendToIPFS(): void;
  handleFileUpload(): void;
  oFile?: any,
  fileContent?: any;
  fileBuffer?: any,
  fileHash?: string,
  filePath?: string,
}
// TODO: add link URL in line 26
const TokenUpload = ({ fileBuffer, oFile, fileHash, filePath, handleSendToIPFS, handleFileUpload }: TokenUploadProps) => {
  return (
    <div className="tokenUpload">
      <button className="buttonExit" />
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

      {/* TODO: remove */}
      <code style={{ backgroundColor: 'salmon', position: 'fixed', left: 0, top: 0, zIndex: 999 }}>
        {'FileBuffer: ' + fileBuffer}
        <br />
        {'oFile: ' + oFile}
        <br />
        {'fileHash: ' + fileHash}
        <br />
        {'filePath: ' + filePath}
      </code>
    </div>
  )
}

export default IPFSHOC(TokenUpload)
