import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';
import CopyConfig from '../Common/CopyConfig';
import DMStackView from './DMStackView';

class DMAccordion extends Component {
  constructor() {
    super();
    this.state = { isOpen: false, stackIndex: -1, tableUpdateID: 0, reload: 0 };
    this.toggle = this.toggle.bind(this);
    this.toggleStack = this.toggleStack.bind(this);
  }

  componentDidMount() {
    const { openByDefault } = this.props;
    if (typeof openByDefault !== 'undefined' && openByDefault === 'true') {
      this.setState({ isOpen: true });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { user } = nextProps;
    const { context } = user;
    const { updateID = 0 } = context;
    const { tableUpdateID = 0 } = prevState;
    if (updateID !== 0 && tableUpdateID !== updateID) {
      return ({ tableUpdateID: updateID, reload: 1 });
    }
    return null;
  }

  toggle() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  toggleStack(index) {
    const { stackIndex } = this.state;
    if (stackIndex === index) {
      this.setState({ stackIndex: -1 });
    } else {
      this.setState({ stackIndex: index });
    }
  }

  resetReload() {
    const { reload } = this.state;
    if (reload === 0) {
      return;
    }
    setTimeout(() => {
      this.setState({ reload: 0 });
    }, 200);
  }

  renderChild(vmMoref) {
    const { dispatch, config, user } = this.props;
    const { stackIndex } = this.state;
    const { data } = config;
    return data.map((conf, index) => (
      <>
        <DMStackView dispatch={dispatch} vmMoref={vmMoref} index={index} user={user} configuration={conf} title={conf.title} hasChildren={conf.hasChildren} key={`stack-view-${index * 1}`} openStack={stackIndex === index} onToggleStack={this.toggleStack} openByDefault={index === 0 ? 'true' : 'false'} />
      </>
    ));
  }

  renderIcon() {
    const { isOpen } = this.state;
    return (
      <div className="wizard-header-options">
        <div className="wizard-header-div configured_icons">
          {isOpen ? <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={this.toggle} />
            : <FontAwesomeIcon size="sm" icon={faChevronRight} onClick={this.toggle} />}
        </div>
      </div>
    );
  }

  renderCopyConfig() {
    const { copyConfig, sourceID, user } = this.props;
    const { values } = user;
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
    if (workflow === UI_WORKFLOW.CREATE_PLAN) {
      const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
      if (typeof copyConfig !== 'undefined' && copyConfig === 'true' && selectedVMs && Object.keys(selectedVMs).length > 1) {
        return (
          <CopyConfig ID={sourceID} />
        );
      }
    }
  }

  render() {
    const { isOpen, reload } = this.state;
    const { title, sourceID } = this.props;
    if (reload > 0) {
      this.resetReload();
      return '';
    }
    return (
      <div key={`dm-accordion-${sourceID}`} className="dmaccordian">
        <Card className="margin-bottom-10 ">
          <CardHeader>
            <Row>
              <Col sm={6}>
                <a id={`dm-accordion-${sourceID}`} href="#" onClick={this.toggle}>
                  {title}
                </a>
              </Col>
              <Col sm={6} className="d-flex flex-row-reverse">
                {this.renderIcon()}
              </Col>
            </Row>
            <Collapse isOpen={isOpen}>
              <CardBody className="padding-left-0 paddings-right-0">
                {this.renderChild(sourceID)}
              </CardBody>
              {this.renderCopyConfig()}
            </Collapse>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

const propTypes = {
  title: PropTypes.string.isRequired,
};

DMAccordion.propTypes = propTypes;
export default (withTranslation()(DMAccordion));
