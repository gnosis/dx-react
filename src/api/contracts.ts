import TruffleContract from 'truffle-contract'
import { promisedWeb3 } from './web3Provider'
import {
  DXAuction,
  ETHInterface,
  GNOInterface,
  OWLInterface,
  TULInterface,
} from './types'

const contractNames = [
  'DutchExchange',
  'EtherToken',
  'TokenGNO',
  'TokenOWL',
  'TokenTUL',
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
  TokenTUL: TULInterface,
  Proxy: { address: string },
}

const Contracts = contractNames.map(name => TruffleContract(require(`../../build/contracts/${name}.json`)))

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
  console.log(await deployedContracts.DutchExchange.thresholdNewTokenPair())

  return (window as any).Dd = deployedContracts
}
