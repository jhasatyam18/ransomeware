import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import ActionButton from '../Common/ActionButton';
import { fetchSupportBundles } from '../../store/actions/SupportActions';
import { openModal } from '../../store/actions/ModalActions';
import { SUPPORT_BUNDLES } from '../../constants/TableConstants';
import { MODAL_GENERATE_SUPPORT_BUNDLE } from '../../constants/Modalconstant';

class Support extends Component {
  constructor() {
    super();
    this.onGenerate = this.onGenerate.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSupportBundles());
  }

  onGenerate() {
    const { dispatch } = this.props;
    const options = { title: 'Generate Support Bundle' };
    dispatch(openModal(MODAL_GENERATE_SUPPORT_BUNDLE, options));
  }

  render() {
    const { dispatch, support, t } = this.props;
    const { bundles } = support;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <Row className="padding-left-30">
                <ActionButton label="Generate" onClick={this.onGenerate} icon="fa fa-plus" isDisabled={false} t={t} key="newsupportbundle" />
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
    );
  }
}

function mapStateToProps(state) {
  const { support } = state;
  return { support };
}
export default connect(mapStateToProps)(withTranslation()(Support));
