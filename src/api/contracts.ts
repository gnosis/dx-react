import TruffleContract from 'truffle-contract'
import {
  DXAuction,
  ETHInterface,
  GNOInterface,
  OWLInterface,
  MGNInterface,
  SimpleContract,
  DeployedContract,
  ContractArtifact,
  PriceOracleInterface,
} from './types'
import { Provider } from 'types'

const contractNames = [
  'DutchExchange',          // Stays in dx-contracts
  'TokenFRT',               // Stays in dx-contracts
  'DutchExchangeProxy',                  // Stays in dx-contracts - will be renamed DutchExchangeProxy
  'EtherToken',             // TODO: > 0.9.0 will be @gnosis/util-contracts
  'TokenGNO',               // TODO: > 0.9.0 will be @gnosis/token-gno
  'TokenOWL',               // TODO: > 0.9.0 will be @gnosis/token-owl
  'TokenOWLProxy',          // TODO: > 0.9.0 will be @gnosis/token-owl
  'PriceOracleInterface',
]

// breaks in rinkeby, cancel for now
// if (process.env.NODE_ENV === 'development') {
//   contractNames.push(
//     'TokenOMG',               // TODO: > 0.9.0 will be deleted - use TokenERC20
//     'TokenRDN',               // TODO: > 0.9.0 will be deleted - use TokenERC20)
//   )
// }

// fill contractsMap from here if available
const filename2ContractNameMap = {
  EtherToken: 'TokenETH',
}

interface ContractsMap {
  DutchExchange:  DXAuction,
  TokenMGN:       MGNInterface,
  TokenETH?:      ETHInterface,
  TokenGNO?:      GNOInterface,
  TokenOWL?:      OWLInterface,
  TokenOMG?:      GNOInterface,
  TokenRDN?:      GNOInterface,
  PriceOracleInterface: PriceOracleInterface,
}

interface ContractsMapWProxy extends ContractsMap {
  DutchExchangeProxy: DeployedContract,
  TokenOWLProxy: DeployedContract,
}

let req: any
if (process.env.FE_CONDITIONAL_ENV === 'development') {
  req = require.context(
    '../../build/contracts/',
    false,
    /(DutchExchange|DutchExchangeProxy|TokenFRT|EtherToken|TokenGNO|TokenOWL|TokenOWLProxy|PriceOracleInterface)\.json$/,
  )
} else {
  req = require.context(
    '@gnosis.pm/dx-contracts/build/contracts/',
    false,
    /(DutchExchange|DutchExchangeProxy|TokenFRT|EtherToken|TokenGNO|TokenOWL|TokenOWLProxy|PriceOracleInterface)\.json$/,
  )
}

export const HumanFriendlyToken = TruffleContract(require('@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'))

type TokenArtifact =
  './DutchExchange.json'      |
  './DutchExchangeProxy.json' |   // rename to DutchExchangeProxy.json in dx-contracts@0.9.3
  './TokenFRT.json'           |
  './TokenOWL.json'           |   // Moving to @gnosis.pm/owl-token
  './TokenOWLProxy.json'      |   // Moving to @gnosis.pm/owl-token
  './EtherToken.json'         |   // Moving to @gnosis.pm/util-contracts
  './TokenGNO.json'           |   // Moving to @gnosis.pm/gno-token
  './TokenOMG.json'           |   // deleted in dx-contracts@0.9.1+
  './TokenRDN.json'               // deleted in dx-contracts@0.9.1+

const reqKeys = req.keys() as TokenArtifact[]
const ContractsArtifacts: ContractArtifact[] = contractNames.map(
  c => {
    if (process.env.FE_CONDITIONAL_ENV === 'production') {
      if (c === 'EtherToken')     return require('@gnosis.pm/util-contracts/build/contracts/EtherToken.json')
      if (c === 'TokenGNO')       return require('@gnosis.pm/gno-token/build/contracts/TokenGNO.json')
      if (c === 'TokenOWLProxy')  return require('@gnosis.pm/owl-token/build/contracts/TokenOWLProxy.json')
      if (c === 'TokenOWL')       return require('@gnosis.pm/owl-token/build/contracts/TokenOWL.json')
    }
    return req(reqKeys.find(key => key === `./${c}.json`))
  },
)

// inject network addresses
const networksUtils = require('@gnosis.pm/util-contracts/networks.json'),
  networksGNO   = require('@gnosis.pm/gno-token/networks.json'),
  networksOWL   = require('@gnosis.pm/owl-token/networks.json'),
  networksDX   = require('@gnosis.pm/dx-contracts/networks.json')

for (const contrArt of ContractsArtifacts) {
  const { contractName } = contrArt
  // assign networks from the file, overriding from /build/contracts with same network id
  // but keeping local network ids
  Object.assign(
    contrArt.networks,
    networksUtils[contractName],
    networksGNO[contractName],
    networksOWL[contractName],
    networksDX[contractName],
  )
}

// in development use different contract addresses
if (process.env.FE_CONDITIONAL_ENV === 'development') {
  // from networks-%ENV%.json
  const networksDX    = require('@gnosis.pm/dx-contracts/networks-dev.json')

  for (const contrArt of ContractsArtifacts) {
    const { contractName } = contrArt
    // assign networks from the file, overriding from /build/contracts with same network id
    // but keeping local network ids
    Object.assign(contrArt.networks, networksDX[contractName])
  }
}

const Contracts: SimpleContract[] = ContractsArtifacts.map(
  art => TruffleContract(art),
)

// name => contract mapping
export const contractsMap = contractNames.reduce((acc, name, i) => {
  acc[filename2ContractNameMap[name] || name] = Contracts[i]
  return acc
}, {}) as {[K in keyof ContractsMapWProxy]: SimpleContract}

export const setProvider = (provider: any) => Contracts.concat(HumanFriendlyToken).forEach((contract) => {
  contract.setProvider(provider)
})

const getPromisedIntances = () => Promise.all(Contracts.map(contr => contr.deployed()))

let contractsAPI: ContractsMap

export const promisedContractsMap = async (provider?: Provider) => {
  if (contractsAPI) return contractsAPI

  contractsAPI = await init(provider)
  return contractsAPI
}

async function init(provider: Provider) {
  try {
    // MetaMaskInpageProvider || EthereumProvider etc.
    setProvider(provider)

    const instances = await getPromisedIntances()

  // name => contract instance mapping
  // e.g. TokenETH => deployed TokenETH contract
    const deployedContracts = contractNames.reduce((acc, name, i) => {
      if (name === 'TokenFRT') {
        acc['TokenMGN'] = instances[i]
      } else {
        acc[filename2ContractNameMap[name] || name] = instances[i]
      }
      return acc
    }, {}) as ContractsMapWProxy

    const { address: proxyAddress } = deployedContracts.DutchExchangeProxy
    deployedContracts.DutchExchange = await contractsMap.DutchExchange.at<Promise<DXAuction>>(proxyAddress)

    const { address: owlProxyAddress } = deployedContracts.TokenOWLProxy
    deployedContracts.TokenOWL = await contractsMap.TokenOWL.at<Promise<OWLInterface>>(owlProxyAddress)

    // remove Proxy contracts from obj
    delete deployedContracts.DutchExchangeProxy
    delete deployedContracts.TokenOWLProxy

    const oracleAddress = await deployedContracts.DutchExchange.ethUSDOracle.call()
    console.debug('OracleAddress: ', oracleAddress)
    deployedContracts.PriceOracleInterface = await contractsMap.PriceOracleInterface.at<Promise<PriceOracleInterface>>(oracleAddress)
    console.debug('PriceOracleInterface.getUSDETHPrice = ', (await deployedContracts.PriceOracleInterface.getUSDETHPrice.call()).toString())

    if (process.env.FE_CONDITIONAL_ENV === 'development') {
      console.log(deployedContracts)
    }

    console.warn(`
      CONTRACTS API INITIALISED
    `)

    return deployedContracts as ContractsMap
  } catch (err) {
    console.error('Contract initialisation error: ', err)
  }
}
