import React from 'react'
import ButtonCTA from 'components/ButtonCTA'

interface TokenUploadProps {
  origFile?: any,
  ipfsFile?: {
    hash?: string,
    name?: string,
  }
}

const TokenUpload = (props: TokenUploadProps) => {
  console.log('PROPS = ', props)
  return (
    <div className="tokenUpload">
      <button className="buttonExit" />
      <span className="icon-tokenUpload" />
      <h2>Upload Token List</h2>
      <p>
        Upload a list of tokens to be added and start trading. JSON formatted files are supported with a max. filesize of 1MB.
      <br />
        Read our <a href="#">FAQ</a> on how this works.
      </p>
      <form>
        <input type="file" name="tokenListFile" accept="application/json,.json" />
        <ButtonCTA
          className="blue"
          // className={!props.hash ? "gray": "blue"}
          // disabled={ !props.hash }
          // onClick={ props.sendToIPFS }
        >
          Upload
        </ ButtonCTA>
      </form>
    </div>
  )
}

export default TokenUpload
