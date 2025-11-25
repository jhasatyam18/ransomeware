import React, { FC } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CardTitle } from 'reactstrap';
import { INITIAL_STATE } from '../../interfaces/interfaces';

interface LoaderProps {
    global: {
        loaderKeys: Record<string, any>;
    };
}

const Loader: FC<LoaderProps & WithTranslation> = ({ global }) => {
    const { loaderKeys } = global;
    const shouldShow = Object.keys(loaderKeys).length > 0;

    const renderMessages = (loaderKeys: any) => {
        const keys = Object.keys(loaderKeys);
        return keys.map((key) => <CardTitle key={key}>{loaderKeys[key]}</CardTitle>);
    };
    if (shouldShow) {
        return (
            <div className="ripple__container position-fixed top-50 start-50">
                <div className="ripple__box">
                    <div className="spinner-chase">
                        <div className="chase-dot" key="r-1-1" />
                        <div className="chase-dot" key="r-1-2" />
                        <div className="chase-dot" key="r-1-3" />
                        <div className="chase-dot" key="r-1-4" />
                        <div className="chase-dot" key="r-1-5" />
                        <div className="chase-dot" key="r-1-6" />
                    </div>
                    <div className="padding-top-30">{renderMessages(loaderKeys)}</div>
                </div>
            </div>
        );
    }
    return null;
};

function mapStateToProps(state: INITIAL_STATE) {
    const { global } = state;
    return {
        global,
    };
}

export default connect(mapStateToProps)(withTranslation()(Loader));
