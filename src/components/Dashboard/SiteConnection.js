import React from 'react';
import ReactFlow from 'react-flow-renderer';
import { connect } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { NODE_POSITIONS } from '../../constants/SiteConnectionConstants';

function SiteConnection(props) {
  function renderNoDataToShow() {
    const { t } = props;
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('site.connection')}
            </p>
            {t('no.data.to.display')}
          </CardBody>
        </Card>
      </>
    );
  }

  function renderer() {
    const { dashboard, t } = props;
    const { titles } = dashboard;
    const { siteConnections, siteDetails } = titles;
    const elements = [];

    if (!siteDetails) {
      return renderNoDataToShow();
    }

    const displayType = (siteDetails.length > 6 ? 'step' : 'default');
    // draw nodes
    for (let i = 0; i < siteDetails.length; i += 1) {
      elements.push(
        { id: `${siteDetails[i].id}`, data: { label: siteDetails[i].name }, type: displayType, position: { x: NODE_POSITIONS[i].x, y: NODE_POSITIONS[i].y } },
      );
    }

    // draw connections
    if (siteConnections) {
      siteConnections.forEach((connection) => {
        elements.push(
          { id: `${connection.sourceID}-${connection.targetID}`, source: `${connection.sourceID}`, target: `${connection.targetID}`, animated: true },
        );
      });
    }

    const element = elements;
    return (
      <Card className="site_connection">
        <CardBody>
          <p className="font-weight-medium color-white">
            {t('site.connection')}
          </p>
          <ReactFlow elements={element} />
        </CardBody>
      </Card>
    );
  }

  return renderer();
}

function mapStateToProps(state) {
  const { dashboard } = state;
  return { dashboard };
}
export default connect(mapStateToProps)(withTranslation()(SiteConnection));
