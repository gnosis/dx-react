import TruffleContract from 'truffle-contract'
import { promisedWeb3 } from './web3Provider'
import {
  DXAuction,
  ETHInterface,
  GNOInterface,
  OWLInterface,
  MGNInterface,
  SimpleContract,
  DeployedContract,
} from './types'

const contractNames = [
  'DutchExchange',
  'EtherToken',
  'TokenGNO',
  'TokenOWL',
  'TokenMGN',
  'Proxy',
]

// fill contractsMap from here if available
const filename2ContractNameMap = {
  EtherToken: 'TokenETH',
}


interface ContractsMap {
  DutchExchange: DXAuction
  TokenETH: ETHInterface,
  TokenGNO: GNOInterface,
  TokenOWL: OWLInterface,
  TokenMGN: MGNInterface,
  Proxy: DeployedContract,
}

const req = require.context(
  '../../node_modules/@gnosis.pm/dutch-exchange-smartcontracts/build/contracts/',
  false,
  /(DutchExchange|Proxy|EtherToken|TokenGNO|TokenOWL|TokenOWLProxy|TokenMGN)\.json$/,
)

type TokenArtifacts = [
  './DutchExchange.json',
  './Proxy.json',
  './EtherToken.json',
  './TokenGNO.json',
  './TokenOWL.json',
  './TokenOWLProxy.json',
  './TokenMGN.json'
]

const reqKeys = req.keys() as TokenArtifacts
const Contracts: SimpleContract[] = contractNames.map(
  c => TruffleContract(req(reqKeys.find(key => key === `./${c}.json`))),
)
// const Contracts = contractNames.map(name => TruffleContract(require(`../../node_modules/@gnosis.pm/dutch-exchange-smartcontracts/build/contracts/${name}.json`)))

// name => contract mapping
export const contractsMap = contractNames.reduce((acc, name, i) => {
  acc[filename2ContractNameMap[name] || name] = Contracts[i]
  return acc
}, {}) as ContractsMap & {DutchExchange: {at: Function}}

(window as any).m = contractsMap

export const setProvider = (provider: any) => Contracts.forEach((contract) => {
  contract.setProvider(provider)
})

const getPromisedIntances = () => Promise.all(Contracts.map(contr => contr.deployed()))

export const promisedContractsMap = init()

async function init() {
  const { currentProvider } = await promisedWeb3
  setProvider(currentProvider)

  const instances = await getPromisedIntances()

  // name => contract instance mapping
  // e.g. TokenETH => deployed TokenETH contract
  const deployedContracts = contractNames.reduce((acc, name, i) => {
    acc[filename2ContractNameMap[name] || name] = instances[i]
    return acc
  }, {}) as ContractsMap

  const { address: proxyAddress } = deployedContracts.Proxy

  deployedContracts.DutchExchange = contractsMap.DutchExchange.at(proxyAddress)
  // console.log(await deployedContracts.DutchExchange.thresholdNewTokenPair())
  console.log(deployedContracts)
  return (window as any).Dd = deployedContracts
}
