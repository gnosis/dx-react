declare var jest, describe, it, expect, require;

import * as React from 'react'
import DutchExchangeInit from '../../api/initialisition'

describe('DutchExchangeInit', () => {
  it('should return an instance of DutchExchangeInit', () => {
    expect( new DutchExchangeInit() ).not.toEqual(null)
  })

  it('should have a contracts property w/Dutch X Contracts attached', async () => {
    const dutchX = await DutchExchangeInit.init(undefined)
    console.log(dutchX)
    const dxContracts = dutchX.contracts

    expect( dxContracts.DutchExchange && dxContracts.DutchExchangeFactory && dxContracts.Token ).not.toEqual(null || undefined)
  })
})
