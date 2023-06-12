import React, { Component } from "react";

class Tiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastValue: '',
    }
  }

  handleChange = (e) => {
    let { value } = e.target
    const { inv, updateInv } = this.props
    if (inv.includes(value)) {
      updateInv(value, this.state.lastValue, inv)
      this.setState({ lastValue: value })
    } else {
      e.target.value = ''
    }
  }
    
  render() {
    const { id } = this.props
    return (
      <div className="tile-div">
        <span className="tile">
          <input
            id={id}
            onChange={this.handleChange}
            type="text"
            maxLength="1"
          />
        </span>
      </div>
    );
  }
  
}

export default Tiles;
