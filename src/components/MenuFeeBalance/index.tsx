import React from 'react'

// Hook in props:
// MGN amount found via TokenMGN.balanceOf(user.address)
// Fee level should be estimated in DX via MGN.totalSupply() vs Users supply
// Fee percentages can be found via Dom's numbers
const MenuFeeBalance = () =>
  <div className="menuFeeBalance">
    <p>MGN <strong>130455.549</strong></p>
    <p>Fee level <strong>0.15%</strong></p>
  </div>

export default MenuFeeBalance
