import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface DRReadyItemRendererProps {
    // Define your prop types here
    data: any;
}

const DRReadyItemRenderer: React.FC<DRReadyItemRendererProps> = ({ data }) => {
    const { recoveryRTO, replicationRPO } = data;
    const icon = recoveryRTO === 'Meets' && replicationRPO === 'Meets' ? faCircleCheck : faCircleXmark;
    const color = recoveryRTO === 'Meets' && replicationRPO === 'Meets' ? 'text-success' : 'text-danger';
    return (
        <div style={{ marginLeft: '13px' }}>
            <FontAwesomeIcon icon={icon} className={`${color} dr_ready_icon_size`} />
        </div>
    );
};

export default DRReadyItemRenderer;