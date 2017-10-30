import React, { PureComponent } from 'react'

interface ButtonCTAProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string,
  onClick(e: React.MouseEvent<HTMLAnchorElement>): void
}

class ButtonCTA extends PureComponent<ButtonCTAProps> {
  static defaultProps: Partial<ButtonCTAProps> = {
    className: 'blue',
  }

  onClick: ButtonCTAProps['onClick'] = (e) => {
    e.preventDefault()

    const { onClick } = this.props
    onClick && onClick(e)
  }

  render() {
    const { className, children, onClick, ...rest } = this.props

    return (
      <a
        href="#"
        className={'buttonCTA ' + (className || '')}
        onClick={this.onClick}
        {...rest}
      >
        {children}
      </a>
    )
  }
}

export default ButtonCTA
