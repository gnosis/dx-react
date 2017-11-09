import DXart from '../../../build/contracts/DutchExchangeETHGNO.json'
import ETHart from '../../../build/contracts/TokenETH.json'
import GNOart from '../../../build/contracts/TokenGNO.json'
import TULart from '../../../build/contracts/Token.json'

import TC from 'truffle-contract'
import Web3 from 'web3'

const DX = TC(DXart)
const ETH = TC(ETHart)
const GNO = TC(GNOart)
const TUL = TC(TULart)

const provider = new Web3.providers.HttpProvider('http://localhost:8545')

DX.setProvider(provider)
ETH.setProvider(provider)
GNO.setProvider(provider)
TUL.setProvider(provider)

describe('ETH 2 GNO contract', () => {
  // TODO: proper types
  let dx: any, eth: any, gno: any, tul: any


  beforeAll(async () => {
    dx = await DX.deployed()
    eth = await ETH.deployed()
    gno = await GNO.deployed()
    tul = await TUL.deployed()
  })


  it('contracts are deployed', async () => {
    expect(dx).toBeTruthy()

    expect(eth).toBeTruthy()

    expect(gno).toBeTruthy()

    expect(tul).toBeTruthy()
  })


  it.skip('ccontracts are deployed with expected data', async () => {
    // initial price is set
    let initialClosingPrice = await dx.closingPrices(0)
    initialClosingPrice = initialClosingPrice.map((x: any) => x.toNumber())

    expect(initialClosingPrice).toEqual([2, 1])

    // sell token is set
    const ETHaddress = await dx.sellToken()
    expect(ETHaddress).toBe(ETH.address)

    // buy token is set
    const GNOaddress = await dx.buyToken()
    expect(GNOaddress).toBe(GNO.address)

    // TUL token is set
    const TULaddress = await dx.TUL()
    expect(TULaddress).toBe(TUL.address)
  })


})
