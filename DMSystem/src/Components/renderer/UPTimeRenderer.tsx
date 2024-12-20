import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { INITIAL_STATE } from '../../interfaces/interfaces';
import { findDifferenceInTimeFromNow } from '../../utils/appUtils';

interface UpTimeRendererProps {
    data: Record<string, any>;
    field: string;
}

const UpTimeRenderer: React.FC<UpTimeRendererProps> = ({ data, field }) => {
    const time = data[field];
    if (typeof time === 'undefined' && time === '') {
        return null;
    }

    return <p>{findDifferenceInTimeFromNow(time)}</p>;
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(UpTimeRenderer));
