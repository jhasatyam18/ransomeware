import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row } from 'reactstrap';
import { MODAL_GENERATE_SUPPORT_BUNDLE } from '../../../constants/Modalconstant';
import { SUPPORT_BUNDLES } from '../../../constants/TableConstants';
import { openModal } from '../../../store/actions/ModalActions';
import { fetchSupportBundles, supportBundleFetched } from '../../../store/actions/SupportActions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import ActionButton from '../../Common/ActionButton';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMTable from '../../Table/DMTable';

class Support extends Component {
  constructor() {
    super();
    this.onGenerate = this.onGenerate.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSupportBundles());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(supportBundleFetched([]));
  }

  onGenerate() {
    const { dispatch } = this.props;
    const options = { title: 'Generate Support Bundle' };
    dispatch(openModal(MODAL_GENERATE_SUPPORT_BUNDLE, options));
  }

  render() {
    const { dispatch, settings, t, user } = this.props;
    const { bundles } = settings;
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <DMBreadCrumb links={[{ label: 'tech.support', link: '#' }]} />
                <Row className="padding-left-30">
                  <ActionButton label="Generate" onClick={this.onGenerate} icon={faPlus} isDisabled={!hasRequestedPrivileges(user, ['support.create'])} t={t} key="newsupportbundle" />
                </Row>
                <DMTable
                  dispatch={dispatch}
                  columns={SUPPORT_BUNDLES}
                  data={bundles}
                />
              </CardBody>
            </Card>
          </Container>
        </>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(Support));
