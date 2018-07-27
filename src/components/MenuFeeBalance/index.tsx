import React from 'react'
import { Balance } from 'types'
// Hook in props:
// MGN amount found via TokenMGN.balanceOf(user.address)
// Fee level should be estimated in DX via MGN.totalSupply() vs Users supply
// Fee percentages can be found via Dom's numbers

export interface MenuFeeBalanceProps {
  feeRatio: number,
  mgnSupply: Balance,
  showFeeRatio: boolean,
}

const MenuFeeBalance = ({ feeRatio, mgnSupply, showFeeRatio }: MenuFeeBalanceProps) =>
  <div className="menuFeeBalance">
    <p>MGN <strong>{showFeeRatio ? mgnSupply : 'N/A'}</strong></p>
    <p>Fee level <strong>{`${showFeeRatio ? feeRatio * 100 : 'N/A'}%`}</strong></p>
  </div>

export default MenuFeeBalance
