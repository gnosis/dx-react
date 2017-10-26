import React, { PureComponent } from 'react'

interface ButtonCTAProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode,
  className?: string,
  onClick(e: React.SyntheticEvent<HTMLAnchorElement>): void
}

class ButtonCTA extends PureComponent<ButtonCTAProps> {
  static defaultProps = {
    className: 'blue',
  }

  onClick = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
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
