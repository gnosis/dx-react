import React from 'react'
import { Balance } from 'types'
import { Link } from 'react-router-dom'
import { URLS, FIXED_DECIMALS } from 'globals'
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
    <p>
      <a
        href={URLS.DXDAO}
        target="_blank"
        title="MAGNOLIA - click for more info"
      >
      MGN <strong>{showFeeRatio ? Number(mgnSupply).toFixed(FIXED_DECIMALS) : 'N/A'}</strong>
      </a>
    </p>
    <p>
      <Link title="Liquidity Contribution - click for more info" to={URLS.LIQUIDITY_CONTRIBUTION}>
      Liq. Contr. <strong>{showFeeRatio ? `${feeRatio * 100}%` : 'N/A'}</strong>
      </Link>
    </p>
  </div>

export default MenuFeeBalance
