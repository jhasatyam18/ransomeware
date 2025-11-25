import React, { useEffect, useState } from 'react';
import { TABLE_LICENSES } from '../../constant/tableConstant';
import { Card, CardBody, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMBreadCrumb from '../shared/DMBreadCrumb';
import { API_LICENSE } from '../../constants/ApiUrlConstant';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { getValue } from '../../utils/apiUtils';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { AppDispatch } from '../../store';
import { DMTable } from '@dm/common-comp';
import { fetchLicenses } from '../../store/actions/actions';
import { getLicenseData } from '../../utils/appUtils';
type LicenseType = {
    dispatch: AppDispatch;
    user: UserInterface;
    license: any;
};
const License: React.FC<LicenseType> = ({ dispatch, user, license }) => {
    const [apiUrl, setApiUrl] = useState<string>('');
    const [tableData, setTableData] = useState<any[]>([]);
    const { values } = user;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';

    useEffect(() => {
        const updatedUrl = SITE_ID.length > 1 ? `${API_LICENSE}siteID=${SITE_ID}` : `${API_LICENSE}`;
        setApiUrl(updatedUrl);
        dispatch(fetchLicenses(SITE_ID));
    }, [SITE_ID]);
    useEffect(() => {
        if (license && Array.isArray(license)) {
            setTableData(getLicenseData(license));
        }
    }, [license]);

    return (
        <Container fluid>
            <Card>
                <CardBody>
                    <DMBreadCrumb links={[{ label: 'License', link: '#' }]} />
                    <DMTable setUrl={setApiUrl} url={apiUrl} isSelectable={false} user={user} dispatch={dispatch} name="license" columns={TABLE_LICENSES} data={tableData} primaryKey="id" />
                </CardBody>
            </Card>
        </Container>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, license } = state;
    return {
        user,
        license,
    };
}

export default connect(mapStateToProps)(withTranslation()(License));
