import React from 'react'
// import ButtonCTA from 'components/ButtonCTA'

class TokenUpload extends React.Component{
  render () {
    return <div className="tokenUpload">

    <button className="buttonExit"></button>

    <span className="icon-tokenUpload"></span>
    	<h2>Upload Token List</h2>
    	<p>Upload a list of tokens to be added and start trading. JSON formatted files are supported with a max. filesize of 1MB. <br/> Read our <a href="#">FAQ</a> on how this works.</p>
    	<form>
    	<input type="file" name="tokenListFile" accept="application/json,.json"/>
    	<input type="submit" value="Upload" className="buttonCTA blue"/>
    	</form>
    </div>
  }
}

export default TokenUpload
