import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { INITIAL_STATE_INTERFACE, MessageProps } from '../../interfaces/interface';
import AppMessage from '../../messages/Messages';
// import AppMessages from '../components/Messages';

interface Props {
    dispatch: Dispatch<any>;
    messages: Record<string, MessageProps>;
}

class MessageContainer extends Component<Props> {
    render() {
        const { messages } = this.props;
        return (
            <>
                <AppMessage {...this.props} messages={messages} />
            </>
        );
    }
}

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { messages } = state;
    return { messages };
}
export default connect(mapStateToProps)(MessageContainer);
