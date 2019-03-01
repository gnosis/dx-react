import React from 'react'

class MenuOneClickToggle extends React.Component {
  state = {
    oneClickMode: false,
  }

  handleClick = () => {
    this.setState({
        oneClickMode: !this.state.oneClickMode,
      })
  }

  render() {
    return <div className="menuFeeBalance">
            <p>
                <button style={{ background: '#eaeef3', border: '#eaeef3' }} onClick={this.handleClick}>
                    {this.state.oneClickMode ? 'Disable' : 'Enable'} <strong> One Click Trade </strong>
                </button>
            </p>
        </div>
  }

}

export default MenuOneClickToggle
