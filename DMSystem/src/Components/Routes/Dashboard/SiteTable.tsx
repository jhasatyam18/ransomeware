import React, { useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import { Dispatch, Action } from 'redux';
import { INITIAL_STATE, SiteInterface, UserInterface } from '../../../interfaces/interfaces';
import { SITE_API } from '../../../Constants/apiConstants';
import { MESSAGE_TYPES } from '../../../Constants/MessageConstants';
import { TABLE_SITE } from '../../../Constants/TableConstants';
import { callAPI } from '../../../utils/apiUtils';
import { addMessage } from '../../../store/actions/MessageActions';
import Table from '../../Table/Table';

interface SiteTableProps extends WithTranslation {
    user: UserInterface;
    dispatch: Dispatch<Action>;
}

const SiteTable: React.FC<SiteTableProps> = ({ dispatch, user, t }) => {
    const [siteData, setSiteData] = useState<SiteInterface[]>([]);
    const refresh = useSelector((state: INITIAL_STATE) => state.user.context.refresh);

    useEffect(() => {
        callAPI(SITE_API).then(
            (data) => {
                const filteredSite = data.filter((site: SiteInterface) => {
                    if (site.node.nodeType === 'Management') {
                        return site.node.isLocalNode; // Include only local site
                    }
                    return true;
                });
                setSiteData(filteredSite);
            },
            (err) => {
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    }, [refresh]);

    return (
        <Card className="box-shadow">
            <CardBody>
                <p className="font-weight-medium">{`${t('Sites')} (${siteData.length})`}</p>
                <Table dispatch={dispatch} columns={TABLE_SITE} data={siteData} primaryKey="id" user={user} />
            </CardBody>
        </Card>
    );
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(SiteTable));
