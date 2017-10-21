declare var jest, describe, it, expect, require;

import * as React from 'react'
import DutchExchangeInit from '../../api/initialisition'

describe('DutchExchangeInit', () => {
  it('should return an instance of DutchExchangeInit', () => {
    expect( new DutchExchangeInit() ).not.toEqual(null)
  })
})
