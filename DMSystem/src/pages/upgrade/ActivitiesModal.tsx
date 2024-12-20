import React from 'react';
import StepStatus from '../../Components/Shared/StepStatus';

interface ActivitiesInterface {
    data: Record<string, any>;
    dispatch: any;
}
const ActivitiesInfoModal: React.FC<ActivitiesInterface> = ({ data, dispatch }) => {
    return (
        <div className="padding-10 pl-10">
            <StepStatus data={data.data} steps={data.steps} maxHeight="80vh" />
        </div>
    );
};

export default ActivitiesInfoModal;
