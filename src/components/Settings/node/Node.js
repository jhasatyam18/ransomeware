import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row } from 'reactstrap';
import ActionButton from '../../Common/ActionButton';
import DMTable from '../../Table/DMTable';
import { openModal } from '../../../store/actions/ModalActions';
import { valueChange, clearValues } from '../../../store/actions';
import { fetchNodes, handleNodeTableSelection, moveNodesToOffline, removeNode, moveNodesToOnline } from '../../../store/actions/NodeActions';
import { TABLE_NODES } from '../../../constants/TableConstants';
import { MODAL_NODE_CONFIGURATION, MODAL_CONFIRMATION_WARNING } from '../../../constants/Modalconstant';

class Node extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    this.onAddNewNode = this.onAddNewNode.bind(this);
    this.onReconfigureNode = this.onReconfigureNode.bind(this);
    this.onRemoveNode = this.onRemoveNode.bind(this);
    this.onOfflineNode = this.onOfflineNode.bind(this);
    this.onOnlineNode = this.onOnlineNode.bind(this);
    dispatch(fetchNodes());
  }

  onAddNewNode() {
    const { dispatch } = this.props;
    const options = { title: 'Configure Node', node: null, isUpdate: false };
    dispatch(clearValues());
    dispatch(openModal(MODAL_NODE_CONFIGURATION, options));
  }

  onReconfigureNode() {
    const { dispatch, settings } = this.props;
    const { selectedNodes } = settings;
    const selectedNodeKey = Object.keys(selectedNodes);
    const options = { title: 'Configure Node', isUpdate: true, id: selectedNodes[selectedNodeKey].id };
    Object.keys(selectedNodes[selectedNodeKey]).forEach((key) => {
      dispatch(valueChange(`node.${key}`, selectedNodes[selectedNodeKey][key]));
    });
    dispatch(openModal(MODAL_NODE_CONFIGURATION, options));
  }

  onRemoveNode() {
    const { dispatch, settings } = this.props;
    const { selectedNodes } = settings;
    const selectedNodeKey = Object.keys(selectedNodes);
    const options = { title: 'Confirmation', confirmAction: removeNode, message: 'Are you sure want to remove selected nodes ?', id: selectedNodes[selectedNodeKey].id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  onOfflineNode() {
    const { dispatch } = this.props;
    const options = { title: 'Confirmation', confirmAction: moveNodesToOffline, message: 'Are you sure you want make selected nodes Offline ?' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  onOnlineNode() {
    const { dispatch } = this.props;
    const options = { title: 'Confirmation', confirmAction: moveNodesToOnline, message: 'Are you sure you want make selected nodes Online ?' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  render() {
    const { settings, dispatch, t, user } = this.props;
    const { nodes, selectedNodes } = settings;
    const selNodes = Object.keys(selectedNodes).length;
    const hasOnline = Object.keys(selectedNodes).some((key) => selectedNodes[key].status === 'online');
    const hasOffline = Object.keys(selectedNodes).some((key) => selectedNodes[key].status === 'offline');
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <Row className="padding-left-30">
                <ActionButton label="New" onClick={this.onAddNewNode} icon="fa fa-plus" isDisabled={false} t={t} key="newsupportbundle" />
                <ActionButton label="Edit" onClick={this.onReconfigureNode} icon="fa fa-edit" isDisabled={selNodes === 0 || selNodes > 1} t={t} key="newsupportbundle" />
                <ActionButton label="remove" onClick={this.onRemoveNode} icon="fa fa-trash" isDisabled={selNodes === 0 || selNodes > 1} t={t} key="newsupportbundle" />
                <ActionButton label="Online" onClick={this.onOnlineNode} icon="fas fa-plug" isDisabled={selNodes === 0 || hasOnline} t={t} key="newsupportbundle" iconColor="#34c38f" />
                <ActionButton label="Offline" onClick={this.onOfflineNode} icon="fas fa-power-off" isDisabled={selNodes === 0 || hasOffline} t={t} key="newsupportbundle" iconColor="#f46a6a" />
              </Row>
              <DMTable
                dispatch={dispatch}
                columns={TABLE_NODES}
                data={nodes}
                primaryKey="id"
                isSelectable
                onSelect={handleNodeTableSelection}
                selectedData={selectedNodes}
                user={user}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(Node));
