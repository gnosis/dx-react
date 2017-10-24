import { initDutchXConnection, getDutchXConnection } from '../../api/dutchx'
import DutchExchangeInit from '../../api/initialization'

describe('DutchExchangeInit', () => {
  it('should return an instance of DutchExchangeInit', () => {
    expect(initDutchXConnection(undefined)).toBeTruthy()
  })

  it('should have a contracts property w/Dutch X Contracts attached', async () => {
    const dutchX = await DutchExchangeInit.init(undefined)
    // console.log(dutchX)
    const dxContracts = dutchX.contracts

    expect(dxContracts.DutchExchange && dxContracts.DutchExchangeFactory && dxContracts.Token).toBeTruthy()
  })

  it('should return an instance of the new Initialisition Class', async () => {
    await DutchExchangeInit.init(undefined)
    const dutchX = await getDutchXConnection()

    console.log('INSTANCE OF CLASS = ', dutchX)
    expect(dutchX).toBeTruthy()
  })
})
