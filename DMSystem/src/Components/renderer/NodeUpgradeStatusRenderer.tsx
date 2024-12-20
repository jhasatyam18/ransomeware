import React from 'react';
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JOB_COMPLETION_STATUS, JOB_FAILED, JOB_IN_PROGRESS } from '../../Constants/statusConstant';

interface Props {
    data: {
        status: string;
    };
}

const NodeUpgradeStatusRendere: React.FC<Props> = (props) => {
    const { data } = props;
    const { status } = data;
    if (status === JOB_COMPLETION_STATUS) {
        return <FontAwesomeIcon size="lg" icon={faCheckCircle} className={`text-success`} />;
    }
    if (status === JOB_FAILED) {
        return <FontAwesomeIcon size="lg" icon={faCircleXmark} className="text-danger" />;
    }
    if (status === JOB_IN_PROGRESS) {
        return <i className="fa fa-spinner fa-lg fa-spin text-info" />;
    }
    return <span>-</span>;
};

export default NodeUpgradeStatusRendere;
