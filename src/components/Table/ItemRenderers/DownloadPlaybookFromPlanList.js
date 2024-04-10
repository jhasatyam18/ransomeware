import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { PLAYBOOK_IN_VALIDATED } from '../../../constants/AppStatus';
import { updateIsPlaybookDownloadedStatus } from '../../../store/actions/DrPlaybooksActions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import PlaybookFileNameRenderer from './PlaybookFileNameRenderer';

function DownloadPlaybookFromPlanList(props) {
  const { drPlaybooks, data, user, dispatch } = props;
  const { id } = data;
  const { templates } = drPlaybooks;
  let downloadURL = '';
  let playbook = '';
  if (templates.length !== 0) {
    templates.forEach((exl) => {
      if (exl.planConfigurations[0].planID === id) {
        downloadURL = `${window.location.protocol}//${window.location.host}/playbooks/${exl.name}`;
        playbook = exl;
      }
    });
  }
  const onDownloadClick = () => {
    if (!hasRequestedPrivileges(user, ['playbook.generate'])) {
      return null;
    }
    if (playbook.playbookStatus === PLAYBOOK_IN_VALIDATED) {
      dispatch(updateIsPlaybookDownloadedStatus(playbook.id));
    }
    const link = document.createElement('a');
    link.href = downloadURL;
    link.click();
  };
  if (downloadURL && playbook) {
    return (
      <>
        <Row>
          <Col sm={1} className="padding-top-3 padding-left-2">
            <a href="#" onClick={onDownloadClick}>
              <FontAwesomeIcon className="single_playbook_download" size="sm" icon={faDownload} />
            </a>
          </Col>
          <Col sm={10}>
            <PlaybookFileNameRenderer data={playbook} field="name" />
          </Col>
        </Row>
      </>
    );
  }
  return '';
}

function mapStateToProps(state) {
  const { drPlaybooks } = state;
  return { drPlaybooks };
}
export default connect(mapStateToProps)(withTranslation()(DownloadPlaybookFromPlanList));
