import React, { Component } from 'react';
import { connect } from 'react-redux';
import { INITIAL_STATE } from '../interfaces/interfaces';
import Loader from '../Components/Shared/Loader';

class GlobalContainer extends Component {
    render() {
        return <Loader {...this.props} />;
    }
}

function mapStateToProps(state: INITIAL_STATE) {
    const { global } = state;
    return { global };
}
export default connect(mapStateToProps)(GlobalContainer);
