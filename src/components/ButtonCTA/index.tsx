import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'


interface ButtonCTAProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string,
  onClick?(e: React.MouseEvent<HTMLAnchorElement>): void,
  to?: string,
}

class ButtonCTA extends PureComponent<ButtonCTAProps> {
  static defaultProps: Partial<ButtonCTAProps> = {
    className: 'blue',
  }

  onClick: ButtonCTAProps['onClick'] = (e) => {
    const { onClick } = this.props

    onClick && onClick(e)
  }

  render() {
    const { className, children, onClick, to = '', ...rest } = this.props

    return (
      <Link
        href="#"
        className={'buttonCTA ' + (className || '')}
        onClick={this.onClick}
        to={to}
        {...rest}
      >
        {children}
      </Link>
    )
  }
}

export default ButtonCTA
