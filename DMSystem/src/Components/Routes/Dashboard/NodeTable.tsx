import React, { useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import { Dispatch } from 'redux';
import { INITIAL_STATE, NodeInterface, UserInterface } from '../../../interfaces/interfaces';
import { NODE_API } from '../../../Constants/apiConstants';
import { MESSAGE_TYPES } from '../../../Constants/MessageConstants';
import { TABLE_NODE } from '../../../Constants/TableConstants';
import { callAPI } from '../../../utils/apiUtils';
import { addMessage } from '../../../store/actions/MessageActions';
import Table from '../../Table/Table';

interface NodeTableProps extends WithTranslation {
    dispatch: Dispatch<any>;
    user: UserInterface;
}

const NodeTable: React.FC<NodeTableProps> = ({ dispatch, user, t }) => {
    const [nodeData, setNodeData] = useState<NodeInterface[]>([]);
    const refresh = useSelector((state: INITIAL_STATE) => state.user.context.refresh);

    useEffect(() => {
        callAPI(NODE_API).then(
            (data) => {
                const filteredNode = data.filter((node: NodeInterface) => {
                    if (node.nodeType === 'Management') {
                        return node.isLocalNode; // Include only local management node
                    }
                    return true;
                });
                setNodeData(filteredNode);
            },
            (err) => {
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    }, [refresh]);

    return (
        <Card className="box-shadow">
            <CardBody>
                <p className="font-weight-medium dashboard-title">{`${t('nodes')} (${nodeData.length})`}</p>
                <Table dispatch={dispatch} columns={TABLE_NODE} data={nodeData} primaryKey="id" user={user} />
            </CardBody>
        </Card>
    );
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(NodeTable));
