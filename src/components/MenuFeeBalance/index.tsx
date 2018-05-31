import React from 'react'
import { Balance } from 'types'
// Hook in props:
// MGN amount found via TokenMGN.balanceOf(user.address)
// Fee level should be estimated in DX via MGN.totalSupply() vs Users supply
// Fee percentages can be found via Dom's numbers

export interface MenuFeeBalanceProps {
  feeRatio: number,
  mgnSupply: Balance,
  noWallet: boolean,
}

const MenuFeeBalance = ({ feeRatio, mgnSupply, noWallet }: MenuFeeBalanceProps) =>
  <div className="menuFeeBalance">
    <p>MGN <strong>{!noWallet && mgnSupply && feeRatio ? mgnSupply : 0}</strong></p>
    <p>Fee level <strong>{`${!noWallet && mgnSupply && feeRatio ? feeRatio * 100 : 0.5}%`}</strong></p>
  </div>

export default MenuFeeBalance
