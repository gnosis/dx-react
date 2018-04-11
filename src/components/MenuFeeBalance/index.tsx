import React from 'react'
import { Balance } from 'types'
// Hook in props:
// MGN amount found via TokenMGN.balanceOf(user.address)
// Fee level should be estimated in DX via MGN.totalSupply() vs Users supply
// Fee percentages can be found via Dom's numbers

export interface MenuFeeBalanceProps {
  feeRatio: number,
  mgnSupply: Balance
}

const MenuFeeBalance = ({ feeRatio, mgnSupply }: MenuFeeBalanceProps) =>
  mgnSupply && feeRatio
    ?
    <div className="menuFeeBalance">
      <p>MGN <strong>{mgnSupply}</strong></p>
      <p>Fee level <strong>{`${feeRatio * 100}%`}</strong></p>
    </div>
    :
    <div className="menuFeeBalance"><p>Loading Fee Info ... </p></div>

export default MenuFeeBalance
