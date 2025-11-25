import React from 'react';
import { NODE_ALERT_TABLE } from '../../constant/tableConstant';

import { DMTable } from '@dm/common-comp';
import { UserInterface } from '../../interfaces/interface';
import { AppDispatch } from '../../store';
type NodeAlertsType = {
    dispatch: AppDispatch;
    data: any;
    user: UserInterface;
};
const NodeAlerts: React.FC<NodeAlertsType> = (props) => {
    const { dispatch, data, user } = props;
    return <DMTable user={user} isSelectable={false} dispatch={dispatch} name="alert" columns={NODE_ALERT_TABLE} data={data} primaryKey="id" url="" setUrl="" />;
};

export default NodeAlerts;
