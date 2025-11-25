import React, { Component } from 'react';
import { connect } from 'react-redux';
import './assets/scss/theme.scss';
// import DMTable from './Components/Table/DMTable';
// import { TABLE_NODE } from './Constants/TableConstants';

class App extends Component<{}> {
    render() {
        return (
            <div className="app">
                <p>shikha</p>
                {/* <DMTable reduxData={''} getItemRendererComponent={} name="sjs" isSelectable={false} columns={TABLE_NODE} data={[]} primaryKey="id" /> */}
            </div>
        );
    }
}

export default connect()(App);
