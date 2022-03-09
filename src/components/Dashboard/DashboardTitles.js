import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Media, Row } from 'reactstrap';
import { API_DASHBOARD_TITLE, API_NODES } from '../../constants/ApiConstants';
import * as Types from '../../constants/actionTypes';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { PROTECTION_PLANS_PATH, SITES_PATH } from '../../constants/RouterConstants';
import { updateTitleInfo } from '../../store/actions/DashboardActions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import { getStorageWithUnit } from '../../utils/AppUtils';
import Spinner from '../Common/Spinner';

function DashboardTitles(props) {
  const { t, dispatch } = props;
  const refresh = useSelector((state) => state.user.context.refresh);
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState({ siteCount: 0, protectionPlans: 0, protectedVMs: 0, protectedStorage: 0 });
  useEffect(() => {
    let isUnmounting = false;
    setLoading(true);
    setTitles({ siteCount: 0, protectionPlans: 0, protectedVMs: 0, protectedStorage: 0 });
    callAPI(API_DASHBOARD_TITLE)
      .then((json) => {
        if (isUnmounting) return;
        setLoading(false);
        const { siteCount, protectionPlans, protectedVMs, protectedStorage, siteConnections, siteDetails } = json;
        const info = { siteCount, protectionPlans, protectedVMs, protectedStorage };
        setTitles(info);
        dispatch(updateTitleInfo({ sites: siteCount, protectionPlans, vms: protectedVMs, storage: protectedStorage, siteConnections, siteDetails }));
      },
      (err) => {
        if (isUnmounting) return;
        setLoading(false);
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    callAPI(API_NODES)
      .then((json) => {
        if (isUnmounting) return;
        dispatch({ type: Types.DASHBOARD_NODES_FETCHED, nodes: json });
      },
      (err) => {
        if (isUnmounting) return;
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });

    return () => {
      isUnmounting = true;
    };
  }, [refresh]);

  const reports = [
    { title: t('sites'), icon: 'cloud', description: titles.siteCount, link: SITES_PATH },
    { title: t('protection.plans'), icon: 'layer', description: titles.protectionPlans, link: PROTECTION_PLANS_PATH },
    { title: t('protected.machines'), icon: 'desktop', description: titles.protectedVMs, link: '#' },
    { title: t('protected.storage'), icon: 'hdd', description: getStorageWithUnit(titles.protectedStorage), link: '#' },
  ];

  return (
    <Row>
      {reports.map((report, key) => (
        <Col md="3" key={`_col_-${key * 2 + refresh}`}>
          <Card className="mini-stats-wid">
            <Link to={report.link}>
              <CardBody>
                <Media>
                  <Media body>
                    <p className="text-muted font-weight-medium">
                      {report.title}
                    </p>
                    <h4 className="mb-0">
                      { loading === true ? (
                        <Spinner />
                      ) : report.description }
                    </h4>
                  </Media>
                  <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
                    <span className="">
                      <box-icon name={report.icon} size="lg" color={report.color ? report.color : 'white'} />
                    </span>
                  </div>
                </Media>
              </CardBody>
            </Link>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

const mapStateToProps = (state) => {
  const { dashboard, user } = state;
  return { dashboard, user };
};

export default connect(mapStateToProps)(withTranslation()(DashboardTitles));
