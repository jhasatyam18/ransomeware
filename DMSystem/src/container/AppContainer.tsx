import React, { Component, ComponentProps } from 'react';
import { connect } from 'react-redux';
import App from '../App';
import { INITIAL_STATE } from '../interfaces/interfaces';

class AppContainer extends Component<ComponentProps<typeof App>> {
    render() {
        return <App {...this.props} />;
    }
}

function mapStateToProps(state: INITIAL_STATE) {
    const { layout, user } = state;
    return {
        layout,
        user,
    };
}
export default connect(mapStateToProps)(AppContainer);
