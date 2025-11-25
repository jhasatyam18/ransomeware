import React, { Component } from 'react';
import { CardTitle } from 'reactstrap';

class Ripple extends Component {
  renderMessages(loaderKeys) {
    const keys = Object.keys(loaderKeys);
    return keys.map((key) => (<CardTitle key={key}>{loaderKeys[key]}</CardTitle>));
  }

  render() {
    const { global } = this.props;
    const { loaderKeys } = global;
    const shouldShow = Object.keys(loaderKeys).length > 0;
    if (shouldShow) {
      return (

        <div className="ripple__container ">
          <div className="ripple__box position-fixed">
            <div className="spinner-chase">
              <div className="chase-dot" key="r-1-1" />
              <div className="chase-dot" key="r-1-2" />
              <div className="chase-dot" key="r-1-3" />
              <div className="chase-dot" key="r-1-4" />
              <div className="chase-dot" key="r-1-5" />
              <div className="chase-dot" key="r-1-6" />
            </div>
            <div className="padding-top-30">
              {this.renderMessages(loaderKeys)}
            </div>
          </div>
        </div>

      );
    }
    return null;
  }
}

export default Ripple;
