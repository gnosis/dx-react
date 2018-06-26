import React from 'react'
import { handleKeyDown } from 'utils/helpers'

interface TokenOverlayHeaderProps {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void,
  closeOverlay(): void,
  value: string,
}

const TokenOverlayHeader: React.SFC<TokenOverlayHeaderProps> = ({ value, onChange, closeOverlay }) => (
  <span className="tokenOverlayHeader" onKeyDown={(e) => handleKeyDown(e, closeOverlay, 27)}>
    <input
      className="tokenSearch"
      type="text"
      name="tokenSearch"
      placeholder="Find token by name or code"
      onChange={onChange}
      value={value}
    />
    <button className="buttonExit" onClick={closeOverlay} />
  </span>
)

export default TokenOverlayHeader
