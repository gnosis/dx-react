import { initDutchXConnection, getDutchXConnection } from '../../api/dutchx';
declare var jest, describe, it, expect, require;

import * as React from 'react';
import DutchExchangeInit from '../../api/initialization'

describe('DutchExchangeInit', () => {
  it('should return an instance of DutchExchangeInit', () => {
    expect( initDutchXConnection(undefined) ).not.toEqual(null)
  })

  it('should have a contracts property w/Dutch X Contracts attached', async () => {
    const dutchX = await DutchExchangeInit.init(undefined)
    // console.log(dutchX)
    const dxContracts = dutchX.contracts

    expect( dxContracts.DutchExchange && dxContracts.DutchExchangeFactory && dxContracts.Token ).not.toEqual(null || undefined)
  })

  it('should return an instance of the new Initialisition Class', async () => {
    const DutchXchange = await DutchExchangeInit.init(undefined)
    const dutchX = await getDutchXConnection()

    console.log('INSTANCE OF CLASS = ', dutchX)
    expect(dutchX).not.toEqual(undefined)
  })
})
