import React, { Component } from 'react';
import { CardTitle } from 'reactstrap';

class Ripple extends Component {
  renderMessages(loaderKeys) {
    const keys = Object.keys(loaderKeys);
    return keys.map((key) => (<CardTitle>{loaderKeys[key]}</CardTitle>));
  }

  render() {
    const { global } = this.props;
    const { loaderKeys } = global;
    const shouldShow = Object.keys(loaderKeys).length > 0;
    if (shouldShow) {
      return (

        <div className="ripple__container">
          <div className="ripple__box">
            <div className="spinner-border text-secondary m-1" role="status" />
            {this.renderMessages(loaderKeys)}
          </div>
        </div>

      );
    }
    return null;
  }
}

export default Ripple;
