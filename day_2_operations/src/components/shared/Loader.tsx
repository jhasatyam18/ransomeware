import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';

interface LoaderProps {
    global: {
        loaderKeys: Record<string, any>;
    };
}

const Loader: React.FC<LoaderProps & WithTranslation> = ({ global }) => {
    const { loaderKeys } = global;
    const shouldShow = Object.keys(loaderKeys).length > 0;

    const renderMessages = (loaderKeys: any) => {
        const keys = Object.keys(loaderKeys);
        return keys.map((key) => <span key={key}>{loaderKeys[key]}</span>);
    };
    if (shouldShow) {
        return (
            <div className="ripple__container position-fixed ">
                <div className="ripple__box">
                    <div className="spinner-chase">
                        <div className="chase-dot" key="r-1-1" />
                        <div className="chase-dot" key="r-1-2" />
                        <div className="chase-dot" key="r-1-3" />
                        <div className="chase-dot" key="r-1-4" />
                        <div className="chase-dot" key="r-1-5" />
                        <div className="chase-dot" key="r-1-6" />
                    </div>
                    <div className="pt-3 fw-bold fs-6">{renderMessages(loaderKeys)}</div>
                </div>
            </div>
        );
    }
    return null;
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { global, user } = state;
    return {
        global,
        user,
    };
}

export default connect(mapStateToProps)(withTranslation()(Loader));
