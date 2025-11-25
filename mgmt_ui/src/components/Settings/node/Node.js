import { faEdit, faPlug, faPlus, faPowerOff, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container } from 'reactstrap';
import { MODAL_CONFIRMATION_WARNING, MODAL_NODE_CONFIGURATION } from '../../../constants/Modalconstant';
import { TABLE_NODES } from '../../../constants/TableConstants';
import { clearValues, valueChange } from '../../../store/actions';
import { openModal } from '../../../store/actions/ModalActions';
import { fetchNodes, handleNodeTableSelection, moveNodesToOffline, moveNodesToOnline, removeNode } from '../../../store/actions/NodeActions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import ActionButton from '../../Common/ActionButton';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMTable from '../../Table/DMTable';

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
    const options = { title: 'Confirmation', confirmAction: removeNode, message: `Are you sure you want to remove ${selectedNodes[selectedNodeKey].name} ?`, id: selectedNodes[selectedNodeKey].id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  onOfflineNode() {
    const { dispatch, settings } = this.props;
    const { selectedNodes } = settings;
    const nodes = Object.values(selectedNodes).map((item) => item.name);
    const options = { title: 'Confirmation', confirmAction: moveNodesToOffline, message: `Are you sure you want to make selected node(s) Offline ${nodes.join(', ')} ?` };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  onOnlineNode() {
    const { dispatch, settings } = this.props;
    const { selectedNodes } = settings;
    const nodes = Object.values(selectedNodes).map((item) => item.name);
    const options = { title: 'Confirmation', confirmAction: moveNodesToOnline, message: `Are you sure you want to make selected node(s) Online ${nodes.join(', ')} ?` };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  render() {
    const { settings, dispatch, t, user } = this.props;
    const { nodes, selectedNodes } = settings;
    const selNodes = Object.keys(selectedNodes).length;
    const hasOnline = Object.keys(selectedNodes).some((key) => selectedNodes[key].status === 'online');
    const hasOffline = Object.keys(selectedNodes).some((key) => selectedNodes[key].status === 'offline');
    // if the selected node has local node then diable the offline button
    const isLocalNode = Object.keys(selectedNodes).some((key) => selectedNodes[key].isLocalNode === true);
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'Nodes', link: '#' }]} />
              <div className="btn-group padding-left-20" role="group" aria-label="First group">
                <ActionButton label="New" onClick={this.onAddNewNode} icon={faPlus} isDisabled={!hasRequestedPrivileges(user, ['node.create'])} t={t} key="newNodeConfiguration" />
                <ActionButton label="Edit" onClick={this.onReconfigureNode} icon={faEdit} isDisabled={(selNodes === 0 || selNodes > 1) || !hasRequestedPrivileges(user, ['node.edit'])} t={t} key="addNewNode" />
                <ActionButton label="remove" onClick={this.onRemoveNode} icon={faTrash} isDisabled={(selNodes === 0 || selNodes > 1) || !hasRequestedPrivileges(user, ['node.delete'])} t={t} key="removeNode" />
                <ActionButton label="Online" onClick={this.onOnlineNode} icon={faPlug} isDisabled={(selNodes === 0 || hasOnline) || !hasRequestedPrivileges(user, ['node.status'])} t={t} key="makeNodeOnline" iconColor="#34c38f" />
                <ActionButton label="Offline" onClick={this.onOfflineNode} icon={faPowerOff} isDisabled={(selNodes === 0 || hasOffline || isLocalNode) || !hasRequestedPrivileges(user, ['node.status'])} t={t} key="makeNodeOffline" iconColor="#f46a6a" />
              </div>
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
