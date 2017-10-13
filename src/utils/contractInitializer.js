/**
 * Contract Initializer Steps
 * 
 * KEY TERMS:
 *  - artifact = contract in JSON form <build/contracts/...>
 * 
 * import TruffleContract from 'truffle-contract'
 * import contractJSON from 'root/build/contract/someContract.json'
 * 
 * const someContract = TruffleContract(contractJSON);
 */

import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import _ from 'lodash'

const contractJSON = [
  'Balance',
].map(name => require(`../../build/contracts/${name}.json`))

/**
 * Sets Provider for each contract ARTIFACT (json file in /build/contracts/...)
 * @returns Object - { contractName: contract_json_full }
 */
const contractInitialiser = async () => {
  let contractsObj
  // Connect each contract to the provider
  try {
    // map over artifacts and create / set provider on all contracts
    // _.fromPairs = lodash util for creating key:value pairs from arrays - see @return
    contractsObj = _.fromPairs(contractJSON.map((json) => {
      // map over each contract artifact and connect them to TruffleContract
      const c = TruffleContract(json)
      const cName = c.contract_name
      // Set the contract provider - defaulted to localhost
      c.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

      return [cName, c]
    }))
    console.log('Success!', contractsObj) /* eslint no-console:0 */
    return contractsObj
  } catch (e) {
    console.log(e)
    return false
  }
}

export default contractInitialiser
