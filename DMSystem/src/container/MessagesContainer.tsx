import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { INITIAL_STATE, MessageProps } from '../interfaces/interfaces';
import AppMessage from '../Components/messages/Messages';
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

function mapStateToProps(state: INITIAL_STATE) {
    const { messages } = state;
    return { messages };
}
export default connect(mapStateToProps)(MessageContainer);
