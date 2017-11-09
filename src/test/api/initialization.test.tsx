/* eslint-disable */
import { initDutchXConnection, getDutchXConnection } from 'api/dutchx'
import DutchExchangeInit from 'api/initialization'
// const Web3 = require('web3')

describe('DutchExchangeInit', () => {
  let dxClass: any
  let dx: any 
  let dxEG: any
  let dxGE: any
  let eth: any 
  let gno: any
  let tul: any

  beforeAll(async () => {
    await initDutchXConnection({ ethereum: 'http://localhost:8545' })
    dxClass =   await getDutchXConnection()
    dx =    dxClass.DutchExchange
    dxEG =  dxClass.DutchExchangeETHGNO
    dxGE =  dxClass.DutchExchangeGNOETH
    tul =   dxClass.Token
    eth =   dxClass.TokenETH
    gno =   dxClass.TokenGNO
  })

  it('should return an instance of DutchExchangeInit', () => {
    expect(dxClass).toBeTruthy()
  })

  it('dutchX should have DEPLOYED contracts attached', async () => {
    expect(dx && dxEG && dxGE && eth && gno && tul).toBeTruthy()
  })

  it('should instantiate contracts w/correct Data', async () => {
    // Check initial Prices are set
    let initialClosingPrice = await dxEG.closingPrices(0)
    initialClosingPrice = initialClosingPrice.map((x: any) => x.toNumber())

    expect(initialClosingPrice).toEqual([2,1])

    // sell Token = set
    const ETHAddress = await dxEG.sellToken()
    expect(ETHAddress).toEqual(dxClass.contracts.TokenETH.address)

    // buyToken === set
    const GNOAddress = await dxEG.buyToken()
    expect(GNOAddress).toEqual(dxClass.contracts.TokenGNO.address)

  })
})
