import React from 'react'

interface TokenOverlayHeaderProps {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void,
  closeOverlay(): void,
  value: string,
  resettable?: boolean,
  reset(): void,
}

const TokenOverlayHeader: React.SFC<TokenOverlayHeaderProps> = ({
  value,
  onChange,
  closeOverlay,
  resettable,
  reset,
}) => (
  <span className="tokenOverlayHeader">
    <input
      className="tokenSearch"
      type="text"
      name="tokenSearch"
      placeholder="Find token by name or code"
      onChange={onChange}
      value={value}
    />
    {resettable && <button className="buttonReset" onClick={reset}>reset</button>}
    <button className="buttonExit" onClick={closeOverlay} />
  </span>
)

export default TokenOverlayHeader
