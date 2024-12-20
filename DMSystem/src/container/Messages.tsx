import React, { Component } from 'react';
import { connect } from 'react-redux';
import { INITIAL_STATE } from '../interfaces/interfaces';
// import AppMessages from '../components/Messages';

class MessageContainer extends Component {
    render() {
        return (
            <>
                <div>shsh</div>
            </>
        );
    }
}

function mapStateToProps(state: INITIAL_STATE) {
    const { messages } = state;
    return { messages };
}
export default connect(mapStateToProps)(MessageContainer);
