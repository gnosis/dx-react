// /* eslint-disable */
// import { initDutchXConnection, getDutchXConnection } from 'api/dutchx'
// // import DutchExchangeInit from 'api/initialization'
// // const Web3 = require('web3')

// describe.skip('DutchExchangeInit', () => {
//   let dxClass: any
//   let dx: any
//   let dxEG: any
//   let dxGE: any
//   let eth: any
//   let gno: any
//   let tul: any
//   let accounts: any
//   let user: any
//   let seller: any
//   let buyer: any

//   beforeAll(async () => {
//     await initDutchXConnection({ ethereum: 'http://localhost:8545' })
//     dxClass = await getDutchXConnection()
//     dx = dxClass.DutchExchange
//     dxEG = dxClass.DutchExchangeETHGNO
//     dxGE = dxClass.DutchExchangeGNOETH
//     tul = dxClass.Token
//     eth = dxClass.TokenETH
//     gno = dxClass.TokenGNO
//     accounts = [...dxClass.web3.eth.accounts]

//     user = accounts[0]
//     seller = accounts[1]
//     buyer = accounts[2]
//   })

//   it('should return an instance of DutchExchangeInit', () => {
//     expect(dxClass).toBeTruthy()
//   })

//   it('dutchX should have DEPLOYED contracts attached', async () => {
//     expect(dx && dxEG && dxGE && eth && gno && tul).toBeTruthy()
//   })

//   it('should instantiate contracts w/correct Data', async () => {
//     // Check initial Prices are set
//     let initialClosingPrice = await dxEG.closingPrices(0)
//     initialClosingPrice = initialClosingPrice.map((x: any) => x.toNumber())

//     console.log('initialClosingPrice = ', initialClosingPrice)
//     expect(initialClosingPrice).toEqual([2, 1])

//     // sell Token = set
//     const ETHAddress = await dxEG.sellToken()
//     console.log('ETHAddress = ', ETHAddress)
//     expect(ETHAddress).toEqual(dxClass.contracts.TokenETH.address)

//     // buyToken === set
//     const GNOAddress = await dxEG.buyToken()
//     expect(GNOAddress).toEqual(dxClass.contracts.TokenGNO.address)

//   })

//   it('should grab Token Balances for each Token - ETH,GNO,TUL', async () => {

//     const instantiatorETHBalance = await eth.balanceOf(user)
//     console.log(instantiatorETHBalance.s)

//     expect(instantiatorETHBalance.s).toBe(1)
//     expect(instantiatorETHBalance.c[0]).toBe(1000000)
//   })
// })
